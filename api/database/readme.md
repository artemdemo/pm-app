# Database

## Tasks table
```
[
  '{{repeat(20)}}',
  {
    id: '{{objectId()}}',
    name: '{{company()}}',
    description: '{{lorem(4)}}',
    priority: '{{integer(1,3)}}',
    status: '{{integer(6,10)}}',
    sp: '{{integer(1,15)}}',
    assignee: '{{integer(1,5)}}',
    author: '{{integer(1,5)}}',
    project: '{{integer(1,2)}}',
    iteration: '{{integer(1,2)}}',
    subtasks: [],
    parent: null,
    created_at: '{{date(new Date(2015, 0, 0), new Date(2016, 0, 0), "YYYY-MM-dd HH:mm:ss")}}'
  }
] 
```

## Projects table
```
[
  '{{repeat(5)}}',
  {
    id: '{{objectId()}}',
    name: '{{company()}}',
    description: '{{lorem(4)}}',
    status: '{{integer(6,10)}}',
    assignee: '{{integer(1,5)}}',
    author: '{{integer(1,5)}}',
    created_at: '{{date(new Date(2015, 0, 0), new Date(2016, 0, 0), "YYYY-MM-dd HH:mm:ss")}}'
  }
]
```


[JSON generator](http://www.json-generator.com/)

