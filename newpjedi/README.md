# ESD_FE

## Tạo SSL window server

Vào:

```

C:\Windows\System32\drivers\etc\hosts

```

Mở File hots điền:

```

  [IP] [Tên miền muốn tạo]

```

Mở powerSell bằng Administrator, dán lệnh:

```

New-SelfSignedCertificate -DnsName [Tên miền muốn tạo] -CertStoreLocation cert:\LocalMachine\My

```

Mở mmc-> File -> Add/Remove Snap-in Chọn Certificates

Vào Personal -> Certificates copy tên miền vừa tạo qua Trusted Root Certification Authorities

Vào IIS them https cho domain và restart IIS
