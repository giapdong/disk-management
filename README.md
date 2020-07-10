# Storage manager với Nodejs

Là một module mình tự chế để quản lý việc phình to dung lượng bất thường.

### Cách sử dụng

Demo

```shell
git clone https://giapdong992@bitbucket.org/giapdong992/devp-project.git devpstudio
cd devpstudio/storage
mkdir result
node test
```

Kết quả: 
```
=========> Start scan memory <==================
Total storage: 526,436 Bytes
=========> Start scan big directory <===========
[
  {
    name: 'F:\\Project\\devp-project\\storage\\node_modules\\assert-plus',
    storage: 11531
  },
  {
    name: 'F:\\Project\\devp-project\\storage\\node_modules\\json-formatter-js\\demo',
    storage: 166579
  },
  {
    name: 'F:\\Project\\devp-project\\storage\\node_modules\\json-formatter-js\\dist',
    storage: 44980
  },
  {
    name: 'F:\\Project\\devp-project\\storage\\node_modules\\json-formatter-js',
    storage: 280220
  }
]
=========> Start write file <==================
Write new status at: ./result/1582859278642
========> Start compare all dir <=============
```

### API

#### var Check = require('./lib/Check') `Check là nơi mình xây dựng nên các module`

##### `Check.setRootDirectory(path)` 

Dùng để thiết lập thư mục gốc - thư mục bắt đầu quét. `Default` là `__dirname`

##### `Check.setBigStorage(value)` 

Sau khi scan, hệ thống sẽ lọc ra các thư mục chứa các `File` với tổng dung lượng lớn hơn value `Default` là `1000000000 B`
 