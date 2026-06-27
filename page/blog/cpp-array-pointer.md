# 数组、指针、字符串

## 数组

### 数组初始化

```c++
//一维数组
int a[3] = {0,1,2};
int a[] = {0,1,2};
int a[4] = {0,1,1}  /剩余得元素自动赋值为0

//若定义数组时没有指定初始值，对于静态生存期得数组，初值为0，对于动态生存期得数组，初值为随机值。
    
//二维数组

```

### 数组作为函数参数

#### 基础类型 int

```c++
void fun(int a[])
{
	a[1]++;
	cout<<a[1]<<endl;
}

int main()
{
    int b[2] = {8,9};
    fun(b);
    cout<<b[1]<<endl;
    return 0;
}
```

形参int a[] 等价于 int * a 接收数组得首地址

```c++
void add_one(int *arr , len)
{
    for(int i=0;i<len;i++)
    {
        arr[i] += 10;
    }
}

void printArr(int *arr , int len)
{
    for(int i = 0 ; i < len ; i++ )
    {
        cout<<arr[i]<<endl;
    }
    cout<<endl;
}
int main()
{
    int nums[4] = {1,2,3,4};
    int lens = 4 ;
    printArr(nums , lens);
    add_one(nums , lens );
    printArr(nums , lens );
    return 0;
}
```

#### char字符数组

字符串本质是以\0结尾的char数组，函数传参操作字符串

```c++
//统计字符串大写字母数量
int countUpper(char str[])
{
    int cnt = 0;
    for(int i=0; str[i] != '\0'; i++)
    {
        if(str[i] >= 'A' && str[i] <='Z')
            cnt++;
    }
    return cnt;
}

//全部转小写
void toLower(char str[])
{
    for(int i = 0; str[i] != '\0' ; i++ )
    {
        if(str[i] >= 'A' && str[i] <= 'Z')
            str[i] += 32;
    }
}

int main()
{
    char s[100] = "hello word c++ ";
    cout<<"upper"<<countUpper(s)<<endl;
    toLower(s);
    cout<<"lower" << s << endl;
    return 0;
}
```

#### 二维数组

二维数组形参**列数必须指定**，行数可省略；同样传首地址

```c++
void print(int num[][4] , int row  )
{
    for(int i=0;i<row; i++ )
    {
        for(int j=0;j<4;j++)
        {
            cout << num[i][j]<<"\t";
        }
        cout<<endl;
    }
}

int main()
{
    int nums[3][4] = {
        {1,2,3,4},
        {5,6,7,8},
        {9,10,11,12}
    };
    print(nums,3);
    return 0;
    
}
```

#### 结构体数组

```c++
struct student
{
    string name;
    int score;
};

void addScore(student stu[] , int len ,int add )
{
    for(int i = 0 ; i < len; i++)
    {
        stu[i].score += add;
    }
}

void show(student stu[], int len)
{
    for(int i = 0 ; i < len ; i ++ )
    {
        cout<<stu[i].name<<"  "<<stu[i].score<<endl;
    }
}

int main()
{
    student class[3] = {
        {"zhang",80},
        {"li",90},
        {"wang",78}
    };
    show(class,3);
    addScore(class,3,10);
    return 0;
}

```



#### 对象数组

```c++
class student
{
    public:
    	string name;
    	int age;
    	student(string n , int a):name(n),age(a){}
};

void growup(student arr[],int num)
{
    for(int i=0;i<num;i++)
    {
        arr[i].age += 1;
    }
}

int main()
{
    student group[2] = {student("ming",16),student("hong",17)};
    growup(group,2);
}
```

---

```c++
void func(int arr[], int len)
void func(int* arr, int len)
```

```c++
void func(int mat[][4], int row)
void func(int mat[3][4], int row)
void func(int (*mat)[4], int row)
```

```c++
// 数组写法
void f(int a[][3][4], int layer);
// 指针等价写法：指向 int[3][4] 数组的指针
void f(int (*a)[3][4], int layer);
```



==重点区分易错写法:==

`int *mat[4]` 是**指针数组**（存放 4 个 int*）



## 指针

数组名就是一个不能被赋值的常量指针

易错题

```c++
int b[]={1,2,3,4}, y, *p = b;
```

y = * p ++	y = 1;

置 ++ 是先使用原值，运算结束后再自增指针

| 表达式       | 执行逻辑                   | y 结果 | p 最终指向 |
| ------------ | -------------------------- | ------ | ---------- |
| `y = *p++`   | 先取 * p，p 再后移         | 1      | b[1]       |
| `y = *(p++)` | 和上面完全等价             | 1      | b[1]       |
| `y = ++*p`   | 先 * p 取值，值 + 1 再赋值 | 2      | b[0]       |
| `y = *++p`   | p 先后移，再取新地址的值   | 2      | b[1]       |

### 对象指针

有两种访问方式

```c++
class Student
{
public:
    string name;
    int age;
    void show()
    {
        cout << name << "，年龄：" << age << endl;
    }
};

int main()
{
    Student s1;
    s1.name = "ming";
    s1.age = 16;
    
    Student *p = &s1 ;
    
    //法一 指针->成员
    p->name = "hong";
    p->age = 17;
    p->show();
    
    //法二 解引用*p
    (*p).name = "gang";
    (*p).age = 16;
    (*p).show();
    return 0;
}
```

在堆中创建对象指针

```c++
    Student *p = new Student;

    p->name = "li";
    p->age = 18;
    p->show();
    delete p;
    p = nullptr;
    return 0;
```

### this指针

this指针指向被成员函数操作的对象



### 指针数组

数组指针：`int (*p)[N]` —— 指针，指向一整个数组

括号包住`*p`，`p`是指针，指向长度为 N 的一维数组（多用于二维数组参数）

```c++
#include <iostream>
using namespace std;

int main()
{
    // 3行4列二维数组，每一行都是 int[4]
    int arr[3][4] = {
        {1,2,3,4},
        {5,6,7,8},
        {9,10,11,12}
    };

    // 数组指针：指向一个长度为4的int数组
    int (*p)[4] = arr; 
    // arr是二维数组首地址，等价于 &arr[0]（第0行数组的地址）

    cout << (*p)[0] << endl; // 解引用p，拿到第0行数组，取第0个元素 → 1
    p++; // 指针跳到下一行（一次性偏移4个int）
    cout << (*p)[1] << endl; // 第1行第1列 → 6

    return 0;
}
```



### 数组指针

指针数组：`int *p[N]` —— 数组，里面每个元素都是指针

`[]`优先级高于`*`，`p`是数组，数组每个元素是`int*`指针（多用于字符串数组）

```c++
//存储多个字符串
#include <iostream>
using namespace std;

int main()
{
    // 指针数组：4个char*指针，分别指向4个字符串常量
    const char *strArr[4] = {
        "苹果",
        "香蕉",
        "橘子",
        "葡萄"
    };

    // 遍历输出
    for(int i=0; i<4; i++)
        cout << strArr[i] << endl;

    return 0;
}
```

```c++
//指向不同一维数组
int a1[2] = {1,2};
int a2[3] = {10,20,30};
int a3[4] = {100,200,300,400};

// 指针数组，3个int*指针
int *p[3] = {a1, a2, a3};

cout << p[0][1] << endl; // 等价 *(p[0]+1) → 2
cout << p[1][2] << endl; // 30
cout << p[2][3] << endl; // 400
```



## 动态内存分配

```c++
int* arr1 = new int[5];    // 5个int，随机垃圾值
int* arr2 = new int[5]();  // 5个int，全部初始化为0
```



### 和vector的区别

```c++
//空容器初始化 0个元素
vector<int> v1;

//拷贝构造
vector<int> v2(v1);

//指定数量+同一初始值
int m = 10;
vector<int> v3(m, 2);

//只指定元素个数+，默认0初始化
vector<int> v4(5);

//初始化列表
// 直接列举元素
vector<int> v5 = {1,3,5,7,9};
// 省略等号简写
vector<int> v6{2,4,6};
```

```c++
#include <iostream>
#include <vector>
using namespace std;

int main()
{
    double sum = 0;
    int n = 0;
    while(cin>>n)
    {
        v1.push_back(n);
        
    }
    
    cout<<"v1"<<v1.size()<<"elements"<<endl;
    
    for(unsigned i=0;i! = v1.size();i++)
    {cout<<v1[i]<<" ";}
    cout<<endl;
    return 0;
}
```

### vector 作为函数参数

#### 引用

```c++
double average(const vector<double> &arr)
    
//调用
int n;
cin>>n;
vector<double> arr(n);
average(arr);
```

#### 指针

```c++
double average(vector<double> *arr)
{
    double sum=0;
    for(unsigned i=0; i<arr->size(); i++)
        sum += (*arr)[i];
    return sum / arr->size();
}
// 调用：average(&v);
```

## 深浅复制

### 浅复制

```c++
#include <iostream>
using namespace std;

// 底层Point点类
class Point
{
private:
    int x, y;
public:
    Point(int xx = 0, int yy = 0) : x(xx), y(yy) {}

    void move(int newX, int newY)
    {
        x = newX;
        y = newY;
    }

    int getX() { return x; }
    int getY() { return y; }
};

// 包含堆指针成员的数组管理类（浅拷贝问题核心类）
class ArrayOfPoints
{
public:
    // 构造函数：堆上开辟Point数组
    ArrayOfPoints(int n) : size(n)
    {
        points = new Point[n];
    }

    // 析构函数：释放堆数组
    ~ArrayOfPoints()
    {
        cout << "Deleting..." << endl;
        size = 0;
        delete[] points;
    }

    // 返回Point元素引用，支持外部修改
    Point &element(int n)
    {
        return points[n];
    }

private:
    Point *points; // 指针成员，浅拷贝根源
    int size;
};

int main()
{
    int count;
    cout << "Please enter the count of points:";
    cin >> count;

    // 创建第一个对象，堆中存储Point数组
    ArrayOfPoints pointsArray1(count);
    pointsArray1.element(0).move(5, 10);
    pointsArray1.element(1).move(15, 20);

    // 浅拷贝：调用编译器默认生成的拷贝构造函数
    ArrayOfPoints pointsArray2(pointsArray1);

    cout << "Original value of array2:" << endl;
    cout << "Point_0 of array2: "
         << pointsArray2.element(0).getX() << ", "
         << pointsArray2.element(0).getY() << endl;
    cout << "Point_1 of array2: "
         << pointsArray2.element(1).getX() << ", "
         << pointsArray2.element(1).getY() << endl;

    // 修改 pointsArray1 中的点
    pointsArray1.element(0).move(25, 30);
    pointsArray1.element(1).move(35, 40);

    // 打印array2，会同步被修改（浅拷贝共享堆内存）
    cout << "After the moving of pointsArray1:" << endl;
    cout << "Point_0 of array2: "
         << pointsArray2.element(0).getX() << ", "
         << pointsArray2.element(0).getY() << endl;
    cout << "Point_1 of array2: "
         << pointsArray2.element(1).getX() << ", "
         << pointsArray2.element(1).getY() << endl;

    cout << "====================================" << endl;
    return 0;
}
```

pointsArray1和pointsArray2指向同一块地址



### 深复制

```c++
// 深拷贝拷贝构造函数
ArrayOfPoints(const ArrayOfPoints &src)
{
    size = src.size;
    // 开辟独立堆内存
    points = new Point[size];
    // 逐个复制元素，不共享内存
    for (int i = 0; i < size; i++)
    {
        points[i] = src.points[i];
    }
}
```



## 字符串

### 字符串常量

```c++
const char * str = "a syring";
cout<<str;
```

### 字符数组初始化

```c++
char str[3] = {'p','r','s'};
char str[3] = "prs";
char str[] = "prs";
```