---
title: read 命令
---

```bash title="read_secret.sh"
#!/bin/bash

# 3s超时自动结束进行并提示错误状态码
if read -t 3 -sp "Enter secret passphrass > " secret_pass; then
  echo -e "\nSecret passphrass = '$secret_pass'"
else
  echo -e "\nInput time out" >&2
  exit 1
fi
```

```bash title="read_integer.sh"
echo -n "Please enter an integer -> "

read int

if [[ "$int" =~ ^-?[0-9]+$ ]]; then
  if [ $int -eq 0 ]; then
    echo "$int is zero."
  else
    if [ $int -lt 0 ]; then
      echo "$int is negative."
    else
      echo "$int is positive."
    fi
    if [ $(($int % 2)) -eq 0 ]; then
      echo "$int is even."
    else
      echo "$int is odd."
    fi
  fi
fi
```
