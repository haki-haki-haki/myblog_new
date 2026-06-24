# 多态

![coding](./assets/images/duotai-banner.jpg)

## 模板

### 1、函数模板

#### 单参数

```c++
template<typename T>  //或者template<class T>
T abs(T x)
{
   return x<0 ? -x:x;
}
```



`函数模板的实例化`编译器从主函数调用，根据实参的类型推导出函数模板的类型参数 

#### 多参数

```c++
template<typename T1,typename T2>
auto add(T1 a , T2 b)
{
 	return a+b;   
}
```

除了编译器自动推导，还可以显式调用

`cout << add<int, double>(3, 5.5) << endl;`  直接给出 用尖括号 < >

---



### 2.类模板

```c++
template<typename T>
class Myarry{
    private:
    	T* arry;
    	int size;
    public:
    	Myarry(int n);
    	~Myarry();
    	void set(int i,T value);
    	T get(int i);
    	int getsize();
};

template<typename T>
Myarry<T>::Myarry(int n)
{
    size = n;
    arry = new T[size];
}

template<typename T>
Myarry<T>::~Myarry()
{
    delete[] arry;   
}

template<typename T>
void template<T>::set(int i,T value)
{
    if(i>=0 && i < size)
    {
        arr[i] = value;
    }  
}

template<typename T>
T template<T>::get(int i)
{
    if(i >= 0 && i < size )
    {
        return arry[i];
    }
    //越界返回默认值
    return T{};
}

template<typename T>
int template<typename T>::getsize()
{
    return size;
}

int manin()
{
    //实例化一个 int 类型的数组
    Myarry<int> intArry(3);
    intArry.set(0,100);
    intArry.set(1,200);
    
}
```

##### 容器（简化版本）

```c++
template<typename T>
class Myvector
{
    private:
    T* data;
    size_t size;
    
    public:
    Myvector(size_t n=0) : size(n),data(new T[n]){}
    ~Myvector(){
        delete[] data;
    }
    
    T& operator[](size_t i){
        return data[i]
    }
    
    size_t size() const{
        return size;
    }
    
    void push_back(const &T value)
    {
        T* newData = new T[size+1];
        for(size_t i=0; i <size ; i++){
            newData[i] = data[i];
        }
        newData[size] = value;
        delete data;
        data = newDatal;
        size++;
    }
    
};

//主函数测试
int main()
{
    int x = 9;
    Myvector<int> arr(x);
    for(int i=0; i < arr.size(); i++ )
    {
        arr[i] = i*10;
    }
    
    arr.push_back(100);
}
```

容器一般用法

```c++
#include <iostream>
#include <vector>
using namespace std;

int main()
{
    // 1. 几种初始化方式
    vector<int> v1;                // 空容器
    vector<int> v2(5);             // 5个元素，默认0
    vector<int> v3(3, 8);          // 3个元素，全为8
    vector<int> v4 = {1,2,3,4,5};  // 直接赋值初始化

    // 2. 尾部增删元素
    v1.push_back(10);  // 末尾添加10
    v1.push_back(20);
    v1.pop_back();     // 删除末尾元素

    // 3. 下标访问
    cout << v4[2] << endl;  // 取下标2元素

    // 4. 获取大小、判空
    cout << v4.size() << endl;   // 实际元素个数
    cout << v4.empty() << endl;  // 为空返回1，否则0

    // 5. 首尾元素
    cout << v4.front() << endl;  // 首元素
    cout << v4.back() << endl;   // 尾元素

    // 6. 清空所有元素
    // v4.clear();

    // 7. 普通for遍历
    for(int i = 0; i < v4.size(); i++)
    {
        cout << v4[i] << " ";
    }
    cout << endl;

    // 8. 范围for遍历
    for(int num : v4)
    {
        cout << num << " ";
    }

    return 0;
}
```



## 重载

- 静态绑定 重载
  - 函数重载
  - 运算符重载

```c++
void func(int a);
void func(double a);

func(10);       // 编译器一眼就能确定：调用func(int)
func(3.14);     // 编译器一眼就能确定：调用func(double)
```



- 动态绑定 多态 实参类型给出

  父类遮挡子类 编译无法判定
  
  ```c++
  class Base{
  public:
      virtual void show(){ cout << "父类" << endl; }
  };
  class Son : public Base{
  public:
      void show(){ cout << "子类" << endl; }
  };
  
  Base *p;
  // 这里编译阶段无法确定p指向谁，只有运行时才知道
  if(条件){
      p = new Base;
  }else{
      p = new Son;
  }
  p->show();
  ```

<span style="color:red;">不允许重载的运算符号 `. .* :: ?:`</span>

运算符重载的实质：只是语法上的方便，另一种函数的调用形式。

---

注意：经过重载的运算符，其操作数至少有一个应该是自定义类型

---





### 1.成员函数

#### 双目运算符

参数个数 = 原来的操作数-1

后置++ --除外



表达式：`opr1 B opr2`相当于 `opr1.operator B(opr2)`

```c++
class compelx{
    private:
    double real;
    double img;
    public:
    complex(double r=0.0, double i = 0.0):real(r),img(i){}
    ~complex(){}
    
    complex operator + (const complex &num1)
    {
        complex num;
        num(this->real+num1.real,this->img+num1.img);
        return num;
    }
    
    complex operator - (const complex &num2)
    {
        complex num;
        num(this->real-num2.real,this->img-num2.img);
        return num; 
    }
}

int main()
{
    compelx c1(5,4),c2(1,1),c3,c4;
    c3 = c1+c2;
    c4 = c1-c2;
    return 0;
}
```

##### 2种return区别

###### 先创建局部变量在return

```c++
Complex operator+(const Complex &c2)
{
    Complex temp(real + c2.real, imag + c2.imag);
    return temp;
}
```



###### 直接return临时对象

```c++
Complex operator-(const Complex &c2)
{
    return Complex(real - c2.real, imag - c2.imag);
}
Complex d = a - b;
```



#### 单目运算符

##### 前置

比如 ++x    相当于 x.operator ++()    ++需要被重载为成员函数 没有形参

时钟类++

```c++
class Clock{
    private:
    int second,minute,hour;
    public:
    Clock(int s , int m , int h):second(s),minute(m),hour(h){}
    ~Clock(){}
    void display();
    Clock ++ ();
}

void Clock::display()
{
    cout<<hour<<" : "<<minute<<" : "<<second<<endl;
}

Clock Clock::operator ++(){ //简单区分一下返回的类型 Clock& 和Clock
    second++;
    if(second>=60){
        minute++;
        second = second - 60 ;
        if(minute>=60)
        {
            hour++;
            minute = minute - 60 ;
            if(hour>=24)
            {
                hour = hour - 24 ;
            }
        }
    }
    
    return *this;
}
```

```c++
#include <iostream>
using namespace std;

class A
{
private:
    int num;
public:
    A(int n = 0) : num(n) {}

    // 前置单目运算符 ++，成员函数，无形参
    A& operator++()
    {
        num++;       // 先自增
        return *this; // 返回自身对象
    }

    void show()
    {
        cout << num << endl;
    }
};

int main()
{
    A m(10);
    ++m;   // 等价于 m.operator++();
    m.show();  // 输出 11
    return 0;
}
```



##### 后置

比如 x--     相当于x.operator --(0)     --需要被重载为成员函数  且参数是int类型的一个占位符     

时钟类后置 ++

```c++
Clock Clock::operator ++( int ){
    Clock old = *this;
    ++(*this);  //利用前面的前置++
    return old; //提前保存旧值
}
```



### 2.非成员函数

<span style="background-color:yellow;">操作数个数 = 原来的操作数个数</span>

函数的形参代表依次从左往右次序排列各自的操作数

后置的++或者--需要在参数列表增加`int`占位符 但是不用写参数名

```c++
class complex{
  private:
    double real,img;
  public:
    compelx(int r=0,int i=0):real(r),img(i){}
    ~compelx(){}
    friend compelx operator+(const complex c1,const complex c2);
    friend complex operator-(const complex c1,const complex c2);
    friend ostream & operator << (ostream &out ,const complex &c);
};

complex operator + (const complex c1,const complex c2)
{
    return complex(c1.real+c2.real,c1.img+c2.img);
    //complex c3;
    //c3(c1.real+c2.real,c1.img+c2.img);
    //return c3;
}

ostream& operator << (ostream &out ,const complex &c)
{
    out<<"("<<c.real<<","<<c.img<<")";
    return out;
}


class complex
{
    private:
    double real,img;
    public:
    complex(double r, double i):real(r),img(i){}
    ~complex(){}
    friend complex operator+(const complex num1,const complex num2);
    friend complex operator-(const complex num1,const complex num2);
    friend ostream & operator << (ostream &out, const complex num);
};

complex operator + (const compelx num1, const complex num2)
{
    return complex( c1.real + c2.real , c1.img + c2.img);
}

compelx operator - (const complex num1 , const complex num2)
{
    return complex(c1.real-c2.real , c1.img - c2.img );
}

ostream& operator << (ostream &out , const compelx num)
{
    out<<"("<<num.real<<","<<num.img<<")";
    
    return out;
}
```

----

不能把<<重载为Complex类的成员函数  重载为成员函数意味着当前类作为第一个操作数（即左操作数） <<的左操作数默认是cout 重载之后就不对了 所以<<不能重载为成员函数

---

### 易错两种覆盖

#### 派生类覆盖基类

==直接调用派生类的对象进行调用==

```c++
Rectangle r1;
r1.getArea();        // 场景A：派生类对象 → 派生类函数隐藏基类，调用Rectangle::getArea()
```



#### 基类覆盖派生类

==派生类对象向上转型为基类的引用/指针==

```c++
Point &s = r1;
s.getArea();         // 场景B：变成基类引用 → 派生类的隐藏失效，调用Point::getArea()
```

---

```c++
#include <iostream>
using namespace std;

class Base
{
public:
    void func()
    {
        cout << "执行基类 func" << endl;
    }
};

class Derived : public Base
{
public:
    // 同名函数，构成【名字隐藏】，没有virtual，不存在重写覆盖
    void func()
    {
        cout << "执行派生类 func" << endl;
    }
};

int main()
{
    // 情况1：直接用派生类对象调用（处在派生类作用域）
    Derived d;
    d.func();
    // 结果：执行派生类 func
    // 原因：派生类同名函数隐藏了基类函数，编译器只在Derived里查找func

    cout << "------分割线------" << endl;

    // 情况2：派生类对象向上转型为基类引用（离开派生类作用域）
    Base &b = d;
    b.func();
    // 结果：执行基类 func
    // 原因：b的声明类型是Base，静态绑定只看类型，只去Base类找func
    // 派生类的隐藏只在Derived类域内生效，转型后隐藏失效
    return 0;
}
```



### 3.虚函数

- 只有类的成员函数才能声明为虚函数，普通函数不能声明为虚函数

内联：编译器决定     虚函数：运行期决定

- 一般内联函数不应该是虚函数，内联函数在编译的时候才能决定它的位置

- 构造函数不能是虚函数

---

- **虚函数表（vtable）**：是一个 “函数地址数组”，存着所有虚函数的地址。

- **虚函数表指针（vptr）**：每个对象里都有一个隐藏的指针，指向它对应类的虚函数表。

当你创建一个对象时，编译器会自动给它加一个隐藏成员 `vptr`，指向它自己类的 vtable：

**vptr 是跟着对象走的，不是跟着指针类型走的**

析构函数可以是虚函数



<u>一个函数一旦被说明成为虚函数，无论他被继承多少层，每一层函数都保持virtual的特性，所以在派生类定义该函数的时候不需要写virtual</u>

---

析构函数可以virtual 但是构造函数不能virtual

但是析构函数的名字都不一样  而普通函数一样

普通虚函数重写规则：函数名、参数、返回值必须完全一致。

但是**析构函数是唯一例外**：

```c++
class Base{
public:
    virtual ~Base(){}
};
class Derived:public Base{
public:
    ~Derived(){}  // 等价于 virtual ~Base()，自动完成重写
};
```

```c++
#include <iostream>
using namespace std;

class Base {
public:
    ~Base();
};

Base::~Base() {
    cout << "Base destructor\n";
}

class Derived: public Base {
public:
    Derived();
    ~Derived();
private:
    int *i_pointer;
};

Derived::Derived() {
    i_pointer = new int(0);
}

Derived::~Derived() {
    cout << "Derived destructor\n";
    delete i_pointer;
}

void fun(Base* b) {
    delete b;
}

int main() {
    Base *b = new Derived();
    fun(b);
    return 0;
}
```

这是析构不加virtual的情况 只会析构基类 会造成内存泄漏



#### 虚函数的正确用法

```c++
int main()
{
    Base *p;   // 基类指针
    p = new Son1;
    p->show(); // 运行派生类1的代码

    p = new Son2;
    p->show(); // 自动切换，运行派生类2的代码
    return 0;
}
```

错误写法

```c++
int main()
{
    Base b = Son1(); // 对象切片，只会保留基类部分
    b.show();        // 永远只执行基类函数，不会调用派生类
    return 0;
}
```

引用同样可以实现多态

函数的形参是引用

```c++
void fun(Base &ref)
{
    ref.show();
}

int main()
{
    Son1 s1;
    Son2 s2;
    fun(s1); // 输出派生类1
    fun(s2); // 输出派生类2
    return 0;
}
```





#### 抽象类

```c++
class base{
  public:
    virtual void display() const=0;
};
```

<span style="color:red;">注意</span>

- 抽象类只能作为基类来使用

- 不能声明抽象类的对象

- 可以定义抽象类的指针和引用

## 易错知识点（指针结合）

### 修饰单个变量

`base *ptr`这个`*`和`base`结合 而不是和`ptr`结合 意味着一个`base`类型的指针



### 连续修饰多个变量

==`*之修饰紧跟的变量`==

```
base *p1 , p2;
//p1是一个base的指针
//p2是一个base的对象
```

如果写成

```c++
base* p1, p2;
//结果和上面一样 p1是base的指针 p2是对象
```

### 定义多个指针

#### 法一

```c++
base *p1, *p2 , *p3 , *p4;
```

#### 法二

```c++
typedef base* base_ptr;
base_ptr ptr1 , ptr2 , ptr3 ;
```

