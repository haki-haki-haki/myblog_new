# 数据保护和共享

## 命名空间

基础访问类型

```c++
#include <iostream>
// 1. 自定义命名空间 NS
namespace NS {
    // 命名空间内：类、函数、变量都可以放
    class File {
    public:
        void show() {
            std::cout << "这是NS里的File类" << std::endl;
        }
    };

    void fun() {
        std::cout << "NS命名空间中的fun函数" << std::endl;
    }

    int num = 100; // 命名空间内变量
}

// 2. 全局普通函数（和NS::fun区分，演示命名冲突）
void fun() {
    std::cout << "全局普通fun函数" << std::endl;
}

int main() {
    // 方式1：命名空间外访问，必须 命名空间::标识符
    NS::File obj;    // 创建NS里的File对象
    obj.show();      // 调用类内方法
    NS::fun();       // 调用NS中的函数
    std::cout << NS::num << std::endl; // 访问NS内变量

    fun(); // 不加前缀，调用全局的fun，不会冲突
    return 0;
}
```

### using的两种用法

```c++
#include <iostream>
namespace NS {
    class File {
    public:
        void show() {
            std::cout << "NS::File" << std::endl;
        }
    };
    void fun() {
        std::cout << "NS::fun" << std::endl;
    }
}

// 全局域的同名函数，和NS::fun重名
void fun() {
    std::cout << "=== 全局域的fun() ===" << std::endl;
}

// 全局不同名函数
void globalPrint() {
    std::cout << "=== 全局独有函数 globalPrint ===" << std::endl;
}

int main() {
    // 用法1：using 单个标识符，只放开 NS::File 这一个名字
    using NS::File;
    File obj;  // 不用写NS::File，直接用File
    obj.show();

    // 但fun还不能直接用，必须加前缀
    NS::fun();

    // 用法2：using namespace NS; 放开NS里面所有标识符
    using namespace NS;
    fun(); // 现在可以直接调用NS里的fun，不用NS::
    ::fun();     // :: 代表全局域，强制调用全局fun
    globalPrint();// 不同名函数不受影响，直接调用
    return 0;
}
```

### 局部变量隐藏同名变量

```c++
int i;       // 全局变量i，属于全局命名空间
namespace Ns {
    int j;    // 命名空间Ns内的变量j
}

int main() {
    i = 5;         // 访问全局i，赋值5
    Ns::j = 6;     // 访问Ns中的j，赋值6

    // 内层代码块，独立局部作用域
    {
        using namespace Ns; // 导入Ns所有标识符，块内可直接写j
        int i;              // 局部变量i，屏蔽外层同名全局i
        i = 7;              // 操作的是【局部i】
        cout << "i = " << i << endl;    // 局部i → 7
        cout << "i = " << ::i << endl;  // ::i 强制访问【全局i】 → 5
        cout << "j = " << j << endl;    // using导入Ns，直接用j → 6
    }

    // 出了内层块，using namespace Ns失效，局部i销毁
    cout << "i = " << i << endl;  // 只能访问全局i → 5
    return 0;
}
```



## 对象生存期

### 静态生存期

程序不退 对象一直存在

- 全局变量声明的对象
- 函数内部用static



### 动态生存期

局部生存期对象



## 类的静态成员

#### 静态成员

类属性，某个属性为整个类所有，不属于一个具体的对象

用关键字`static`声明

必须在类外定义和初始化 ::指明所属的类



```c++
class point
{
    private:
    int x,y;
    static int count;
    public:
        point(int xx = 0,int yy = 0){x = xx; y = yy;}
    	point(point &p);
    	~point(){count--;}
    void showCount()
    {
        cout<<"object count : "<<count<<endl;
    }
}

point::point(point &p)
{
    x = p.x;
    y = p.y;
    count++;
}

int point::count=0;
```

#### 静态成员函数

- 静态成员函数**不属于任何对象，属于类本身**，没有隐含的 `this` 指针，只能访问类内**静态成员变量 / 静态函数，不能访问普通非静态成员。

- 无 `this` 指针，**不能访问非静态成员变量 / 普通成员函数**（非静态成员依赖对象）；

- 只能访问类内 `static` 修饰的变量、函数；

- 不能用 `const` 修饰（`const` 修饰函数本质是修饰 `this`，静态函数没有 this）。

```c++
#include <iostream>
using namespace std;

class Foo{
public:
    static void f();
    static void g();
private:
    static int global; // 静态成员变量
};
int Foo::global = 0; // 类外初始化静态变量

void Foo::f() {
    global++;
}
void Foo::g() {
    cout << global << endl;
}

int main() {
    Foo::f();
    Foo::g(); // 输出 1
    Foo::f();
    Foo::g(); // 输出 2
    return 0;
}
```

```c++
#include <iostream>
using namespace std;

class A {
public:
    static void f(A a);
private:
    int x; // 非静态成员，每个对象独立拥有
};

void A::f(A a) {
    // cout << x;  // 错误写法，编译报错
    cout << a.x;  // 正确写法
}
```

##### 静态成员的访问

- 类名::静态成员
- 对象名.静态成员



## 友元

### 友元函数

friend修饰 非本类成员函数

通过对象名可以访问private protected

友元函数可以是普通函数也可以是其他类的成员函数

#### 普通函数作为友元

```c++
class point
{
    private:
    int x,y;
    public:
    point(int xx=0 , int yy=0) {x = xx , y= yy;}
    friend double dist(point &p1, point &p2);
        
}

double dist(point &p1, point &p2)
{
    double x = p1.x-p2.x;
    double y = p1.y-p2.y;
    return sqrt(x*x,y*y)
}

int main()
{
    point p1(3.0,4.0) , p2(0.0,0.0);
    double d = dist(p1,p2);
    cout<<d<<endl;
    return 0;
}
```

#### 其他类的函数作为友元函数

```c++
#include <iostream>
using namespace std;

// 1. Student前向引用声明
class Student;

// 2. 定义Teacher类
class Teacher{
public:
    // 成员函数声明，参数是Student引用
    void setScore(Student &s, float f);
private:
    char *name;
};

// 3. 定义Student类
class Student{
public:
    // 声明Teacher类的setScore为本类友元成员函数
    friend void Teacher::setScore(Student &s, float f);
private:
    float score; // 私有成员分数
};

// 4. Teacher::setScore函数实现
void Teacher::setScore(Student &s, float f) {
    // 友元权限：直接访问Student私有成员score
    s.score = f;
}
```

### 友元类

```c++
#include <iostream>
using namespace std;

// 前向声明类A，让B能识别A类型
class A;

// 定义B类
class B {
public:
    A a; // B内部持有A对象
    void set(int i);
    void display();
};

// 定义A类，将B声明为自己的友元类
class A {
    // 友元类声明：B中所有成员函数都能访问A的私有成员
    friend class B;
private:
    int x; // A的私有成员
public:
    void display() {
        cout << "A的私有成员x = " << x << endl;
    }
};

// B类set函数：直接修改A的私有x
void B::set(int i) {
    a.x = i; // 正常访问，因为B是A的友元类
}

// B类display函数：调用A的display方法
void B::display() {
    a.display();
}

int main() {
    B b;
    b.set(88);
    b.display(); // 输出 A的私有成员x = 88
    return 0;
}
```





## 数据共享保护

### const

const 关键字可以用作重载

语法格式 返回类型 函数名() const

类里面的常数据成员只能在初始化列表中赋值

```c++
#include <iostream>
using namespace std;

class A {
private:
    const int a;        // 普通常数据成员：每个对象独有，不可修改
    static const int b; // 静态常数据成员：全类共享，不可修改
public:
    // 普通const成员a必须在【初始化列表】赋值，不能在函数体内赋值
    A(int i) : a(i) {}

    void print() {
        cout << a << " : " << b << endl;
    }
};

// 静态常量成员类外初始化（C++98标准强制要求）
const int A::b = 10;

int main() {
    A obj1(5);
    A obj2(8);
    obj1.print(); // 输出 5 : 10
    obj2.print(); // 输出 8 : 10
    return 0;
}
```
