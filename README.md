# lighthouse demo

## install

### nodejs

```bash
linux:~ # curl -LO https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz
linux:~ # xz -dc node-v22.12.0-linux-x64.tar.xz | tar xf - -C /usr/local/
linux:~ # ln -s /usr/local/node-v22.12.0-linux-x64/bin/{node,npm,npx} /usr/local/bin/.
```

### chrome

```bash
# for rhel-base
linux:~ # curl -OL https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
linux:~ # dnf install ./google-chrome-stable_current_x86_64.rpm

# for debian-base
linux:~ # curl -OL  https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
linux:~ # apt install ./google-chrome-stable_current_amd64.deb
```

### package

```bash
linux:~ $ git clone
linux:~ $ cd lighthouse-demo
linux:~/lighthouse-demo $ npm in
linux:~/lighthouse-demo $ npm ls
```

---

## run

```bash
linux:~/lighthouse-demo $ node <file>.js
```

---

## sample

- [sample1](./sample/sample1.js) use chrome-launcher
- [sample1](./sample/sample1.js) use puppeteer, setting screen resolution: 1920x1080
