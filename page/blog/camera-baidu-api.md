# 摄像头 与 百度API 识别代码讲解

本项目的摄像头拍照和百度车牌/车型识别功能集中在 **4 个文件** 中：

| 文件 | 作用 |
|---|---|
| `camerarecognizer.h` | CameraRecognizer 类的声明 |
| `camerarecognizer.cpp` | CameraRecognizer 类的实现（核心） |
| `mainwindow.h` | MainWindow 类中与识别器交互的声明 |
| `mainwindow.cpp` | MainWindow 中调用识别器的槽函数 |

## 一、camerarecognizer.h —— 头文件

```cpp
#include <QObject>
#include <QString>
#include <QStringList>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QCamera>
#include <QMediaCaptureSession>
#include <QImageCapture>
#include <QVideoWidget>
#include <QTimer>
#include <QWidget>
```

- **QNetworkAccessManager** —— 百度 API 是 HTTP 接口，需用这类发 GET / POST 请求  
- **QCamera / QMediaCaptureSession / QImageCapture / QVideoWidget** —— Qt6 多媒体框架

```cpp
class CameraRecognizer : public QObject
{
    Q_OBJECT
```

**Q_OBJECT** 是 Qt 核心宏，有 signals / slots 就必须加。

```cpp
public slots:
    void openImageFile();
    void recognizeCurrentImage();
    void startMonitoring(QWidget *container);
    void stopMonitoring();

signals:
    void plateRecognized(const QString &plate, const QString &carType);
    void monitoringStarted();
    void monitoringStopped();
```

```cpp
private slots:
    void onNetReplyFinished(QNetworkReply* reply);
    void onImageSaved(int id, const QString& path);
    void onCaptureTimerTimeout();
    void onCameraErrorOccurred(QCamera::Error error, const QString& errorString);
```

```cpp
private:
    void getAccessToken();          // 申请车牌识别的 access_token
    void getCarAccessToken();       // 申请车型识别的 access_token
    QString imgToBase64(const QString& filePath);
    void sendOCRRequest(const QString& base64Img);
    void sendCarModelRequest(const QString& base64Img);
    QString classifyCarType(const QString& carName);
```

- **getAccessToken / getCarAccessToken**：OAuth2.0 Client Credentials 模式换 token  
- **imgToBase64**：图片 → Base64 字符串  
- **classifyCarType**：把百度返回车名映射为 轿车/SUV/货车/客车/MPV/跑车  

```cpp
    QNetworkAccessManager* m_netMgr;
    QString m_currentImagePath;
    QString m_accessToken;
    QString m_carAccessToken;
    bool m_isRequestingToken = false;
    bool m_pendingCarToken = false;
    bool m_pendingCarModel = false;
    QStringList m_pendingPlates;

    QCamera* m_camera = nullptr;
    QMediaCaptureSession* m_captureSession = nullptr;
    QImageCapture* m_imageCapture = nullptr;
    QVideoWidget* m_videoWidget = nullptr;
    QTimer* m_captureTimer = nullptr;
    bool m_isMonitoring = false;
    QString m_lastCapturedPath;

    const QString API_KEY = "rNOSKa9kyUmcfCh1Hn0OGfjm";
    const QString SECRET_KEY = "1YClwCihBeYfI2BgQHVk9WW2Vegj8PWH";
    const QString API_KEY_CAR = "nFsIFrfAlG3F5hfl5JI6b0vq";
    const QString SECRET_KEY_CAR = "Pew8d34EMSmGIqFQ3vaZQgQfWIELJVgD";
```

> ⚠ API Key 建议放配置文件，不要硬编码。

## 二、识别流程

### 手动识别

```
打开图片 → openImageFile() → QFileDialog 选图
点识别 → recognizeCurrentImage()
    → imgToBase64() 编码
    → sendOCRRequest() 车牌识别
    → sendCarModelRequest() 车型识别
    → classifyCarType() 分类
    → emit plateRecognized(车牌, 车型)
```

### 自动监控（每5秒一次）

```
startMonitoring(container)
    → QVideoWidget 嵌入容器
    → m_camera->start() + m_captureTimer->start(5000)

每 5 秒：
    → onCaptureTimerTimeout() → captureToFile()
    → onImageSaved() → imgToBase64() → 走识别流程
```

### 百度 API 鉴权

```
GET https://aip.baidubce.com/oauth/2.0/token
  ?grant_type=client_credentials
  &client_id=API_KEY
  &client_secret=SECRET_KEY
  
返回: {"access_token": "xxx", "expires_in": 2592000}
```

## 三、两个 API 接口

| | 车牌识别 | 车型识别 |
|---|---|---|
| **接口** | `/rest/2.0/ocr/v1/license_plate` | `/rest/2.0/image-classify/v1/car` |
| **调用函数** | `sendOCRRequest()` | `sendCarModelRequest()` |
| **返回** | `words_result[].number` | `result[0].name` |
| **关键参数** | `multi_detect: true` | `top_num: 1` |

## 四、关键 Qt 类速查

| Qt 类 | 作用 |
|---|---|
| `QNetworkAccessManager` | 发送 HTTP 请求 |
| `QCamera` | 摄像头设备 |
| `QMediaCaptureSession` | 连接摄像头、捕获器、视频输出 |
| `QImageCapture` | 捕获一帧保存为图片 |
| `QVideoWidget` | 显示实时画面 |
| `QTimer` | 定时器（每5秒拍照） |
| `QJsonDocument` | 解析 JSON |
| `QByteArray::toBase64()` | 二进制 → Base64 |

---

> *Qt6 + 百度AI · 摄像头车牌/车型识别 · haki*
