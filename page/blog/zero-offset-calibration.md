# BMI088 零偏校准原理与代码分析

零偏校准

（Zero Offset）是指当 IMU（惯性测量单元）处于静止状态时，陀螺仪和加速度计仍然输出的非零值。这个偏移量主要由以下原因造成：

传感器本身的制造误差

温度漂移



---

## 哈尔滨工程大学代码中的零偏校准实现

### 校准参数结构体

在 `BMI088driver.h` 中定义了 `IMU_Data_t` 结构体：

```c
typedef struct
{
    float Accel[3];           // 加速度计三轴数据
    float Gyro[3];            // 陀螺仪三轴数据
    float TempWhenCali;       // 校准时温度
    float Temperature;        // 当前温度
    float AccelScale;         // 加速度计标度因数
    float GyroOffset[3];      // 陀螺仪零偏（三轴）
    float gNorm;              // 重力加速度模值
} IMU_Data_t;
```

---

## 零偏校准流程详解

### 校准函数调用入口

```c
// BMI088driver.c 第120-131行
uint8_t BMI088_init(SPI_HandleTypeDef *bmi088_SPI, uint8_t calibrate)
{
    BMI088_SPI = bmi088_SPI;
    error = BMI088_NO_ERROR;

    error |= bmi088_accel_init();
    error |= bmi088_gyro_init();
    
    if (calibrate)
        Calibrate_MPU_Offset(&BMI088);  // 执行校准
    else
    {
        // 使用预定义的校准参数
        BMI088.GyroOffset[0] = GxOFFSET;
        BMI088.GyroOffset[1] = GyOFFSET;
        BMI088.GyroOffset[2] = GzOFFSET;
        BMI088.gNorm = gNORM;
        BMI088.AccelScale = 9.81f / BMI088.gNorm;
        BMI088.TempWhenCali = 40;
    }
    return error;
}
```



  核心校准算法  原版是取6000次数据   先自行更改为舍弃前2000次数据 

```c
// BMI088driver.c 第272-418行
void Calibrate_MPU_Offset(IMU_Data_t *bmi088)
{
    // 采样配置
    const uint16_t TotalCaliTimes = 6000;   // 总采样次数
    const uint16_t DiscardTimes = 2000;     // 前2000次丢弃
    const uint16_t ValidTimes = 4000;        // 后4000次有效

    uint16_t caliCount = 0;
    
    do {
        // 超过10秒则超时，使用默认值
        if (DWT_GetTimeline_s() - startTime > 10) {
            bmi088->GyroOffset[0] = GxOFFSET;
            // ...
            break;
        }
        
        DWT_Delay(0.005);  // 5ms采样间隔
        
        // 重置累加器
        bmi088->gNorm = 0;
        bmi088->GyroOffset[0] = bmi088->GyroOffset[1] = bmi088->GyroOffset[2] = 0;
        
        // 共采集6000次
        for (uint16_t i = 0; i < TotalCaliTimes; i++) {
           读取加速度计原始数据
            BMI088_accel_read_muli_reg(BMI088_ACCEL_XOUT_L, buf, 6);
            bmi088->Accel[0] = bmi088_raw_temp * BMI088_ACCEL_SEN;
    
            
       		 计算重力加速度模值
            gNormTemp = sqrtf(AccelX^2 + AccelY^2 + AccelZ^2);
            
            读取陀螺仪原始数据
            BMI088_gyro_read_muli_reg(BMI088_GYRO_CHIP_ID, buf, 8);
            bmi088->Gyro[0] = bmi088_raw_temp * BMI088_GYRO_SEN;
       
            
            前2000次数据丢弃（传感器启动稳定期）
            if (i < DiscardTimes) {
                DWT_Delay(0.0005);
                continue;
            }
            
            后4000次数据累加求和
            bmi088->gNorm += gNormTemp;
            bmi088->GyroOffset[0] += bmi088->Gyro[0];
            bmi088->GyroOffset[1] += bmi088->Gyro[1];
            bmi088->GyroOffset[2] += bmi088->Gyro[2];
            
            //  检测数据稳定性（运动检测）
            // 如果数据波动太大，说明有运动，中断本次校准
            if (gNormDiff > 0.5f || gyroDiff[0] > 0.15f ...)
                break;
        }
        
        // 取平均值 = 零偏
        bmi088->gNorm /= ValidTimes;
        for (uint8_t i = 0; i < 3; i++)
            bmi088->GyroOffset[i] /= ValidTimes;
        
        //  记录校准温度
        bmi088->TempWhenCali = Read_Temperature();
        
        caliCount++;
        
    } while (质量检查不通过);  // 重复校准直到数据合格
}
```

### 校准质量控制

循环退出的条件（

```c
} while (gNormDiff > 0.5f ||                    // 加速度模值波动 < 0.5
         fabsf(bmi088->gNorm - 9.8f) > 0.5f ||    // 加速度模值接近9.8
         gyroDiff[0] > 0.15f ||                   // X轴角速度波动 < 0.15
         gyroDiff[1] > 0.15f ||                   // Y轴角速度波动 < 0.15
         gyroDiff[2] > 0.15f ||                   // Z轴角速度波动 < 0.15
         fabsf(bmi088->GyroOffset[0]) > 0.01f ||  // X轴零偏合理
         fabsf(bmi088->GyroOffset[1]) > 0.01f ||  // Y轴零偏合理
         fabsf(bmi088->GyroOffset[2]) > 0.01f);   // Z轴零偏合理
```



## 中科学技术大学零偏校准核心函数

### 一阶低通滤波

```c
fp32 gyro_offset[3];           // 当前使用的陀螺仪零偏（实时更新）
fp32 gyro_cali_offset[3];      // 保存的校准零偏值（可从Flash读取）
fp32 accel_offset[3];          // 加速度计零偏
fp32 mag_offset[3];            // 磁力计零偏
fp32 gyro_scale_factor[3][3];  // 陀螺仪安装旋转矩阵

// INS_task.c:369-380
void gyro_offset_calc(fp32 gyro_offset[3], fp32 gyro[3], uint16_t *offset_time_count)
{
    if (gyro_offset == NULL || gyro == NULL || offset_time_count == NULL)
    {
        return;
    }
    // 一阶指数滤波算法
    gyro_offset[0] = gyro_offset[0] - 0.0003f * gyro[0];
    gyro_offset[1] = gyro_offset[1] - 0.0003f * gyro[1];
    gyro_offset[2] = gyro_offset[2] - 0.0003f * gyro[2];
    (*offset_time_count)++;
}
```

```
offset(k) = offset(k-1) - α × gyro(k)
```

一阶低通滤波公式

