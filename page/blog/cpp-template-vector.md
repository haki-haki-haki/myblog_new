# C++ 模板与 Vector 学习笔记

## 函数重载

```c++
int add(int a , int b)
{
    return a+b;
}

float add(float a, float b)
{
    return a+b;
}


```

<!--仅仅靠返回值是不能实现函数重载的 会报错-->



## 类模板

### 单个类模板

```c++
#include <iostream>
#include <string>
using namespace std;

template <typename T>
class Box
{
    private:
    T data;
    public:
    Box(T val) : data(val) {}
    
    void setdata(T val)
    {
        data = val;
    }
    T getData()
    {
        return data;
    }
    
    void show()
    {
        cout<<"vector 's digitals "<< data << endl;
    }
};

int main()
{
    Box<int> intBox(100);
    int.Box.show();
    cout << intBox.getData << endl;
}
```

### 多个类模板

#### 类模板内部定义

```c++
template <typename T1 , typename T2>
class Box
{
    private:
    T1 first;
    T2 second;
    public:
    Box(T1 first_new , T2 second_new): first(first_new) , second(second_new)
    {
        
    }
    
    void print()
    {
        cout<<first<<" "<<second<<endl;
    }
};

int main()
{
    Box1<int , string > box1(2026 , "hello");
    box1.print();
    
    box2<float , int > box2(10.2, 3);
    box2.print();
    
    box3<double , bool > box3(11.1,true);
    box3.print();
    
    return 0;
}
```

#### 类模板外部定义

```c++
template <typename T>
class Max_Num
{
    private:
    T a , T b;
    public:
    Max_Num(T x, T y);
    T getNum(T x , T y);
    
};

template <typename T>
Max_Num<T>::Max_Num(T x , T y)
{
    a = x;
    b = y;
    
}

template <typename T>
T Max_Num<T>::getNum()
{
    return (a > b) ? a : b;
}

int main()
{
    Max_Num<int> m1(15,10);
    cout<<"max"<<m1.getNum()<<endl;
}
```

## Vector

### 用法

```c++
#include <vector>
using namespace std;

int main()
{
    vector<int>vecint;
    
    vecint.push_back(10);
    vecint.push_back(11);
    vecint.push_back(12);
    
    cout<<"vector 's digital ";
    for(int i=0;i<vecint.size(); i++)
    {
        cout<<vecint[i] << " ";
    }
    cout<<endl;
    
    vecint.pop_back();
    return 0;
}
```

### 自定义vector

```c++
template <typename T>
class Myvector
{
    private :
    T* arr;
    int num;
    int len;
    
    public :
    Myvector()
    {
        capacity = 4;
        len = 0;
        arr = new T[capacity];
    }
    
    void push_back(T val)
    {
        if(len >= capacity)
        {
            capacity *= 2;
            T* temp = new T[capacity];
            for(int i=0;i<len;i++)
            {
                temp[i] = arr[i];
            }
            delete[] arr;
            arr = temp;
        }
        arr[len++] = val;
    }
    
    T
        
    
}
```

---

> *C++ 模板与 STL 学习笔记 · haki*
