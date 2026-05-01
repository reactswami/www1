import { HttpResponse } from 'msw';

export async function getCertificates() {
   return HttpResponse.json(
      {
         meta: {},
         result: [
            {
               client_cert:
                  'Certificate:\nData:\nVersion: 3 (0x2)\nSerial Number:\nfe:36:4f:8f:08:ee:c5:66:12:1c:71:8e:e6:54:5b:aa\nSignature Algorithm: sha256WithRSAEncryption\nIssuer: CN=ct-ca.statseeker.com\nValidity\nNot Before: Apr  7 12:19:53 2025 GMT\nNot After : Jul 11 12:19:53 2027 GMT\nSubject: CN=jpb-test-client\nSubject Public Key Info:\nPublic Key Algorithm: rsaEncryption\nPublic-Key: (2048 bit)\nModulus:\n00:a4:50:3d:9f:85:ac:a5:dc:b7:44:f0:7f:f9:2d:\n7d:25:09:f6:d4:e0:8f:15:e5:58:b6:18:88:78:22:\n4d:4a:f1:2e:b2:20:d5:12:b2:82:10:09:0e:7d:72:\n00:ee:91:97:6f:6c:b8:01:d0:54:7f:c4:ec:0d:fd:\n7a:a4:d0:e4:60:4f:b5:18:f6:36:48:fd:f1:d9:49:\nc3:72:94:fa:4f:f5:c9:2b:ef:8c:74:56:4c:f8:3e:\na4:7e:33:a0:1c:ca:e0:fd:7c:96:8f:66:0b:30:20:\na0:22:11:39:3e:75:e7:f0:e8:63:28:58:b8:39:51:\n98:43:1f:d2:37:7b:75:c7:7f:76:7a:44:d4:fd:c6:\n65:cc:25:b2:86:8b:21:82:e6:90:fa:b5:b3:05:ed:\nee:cd:f0:26:a0:f8:44:f7:e6:f0:68:01:46:75:c9:\n1c:1b:b4:02:d7:d0:64:45:59:d2:5c:cc:77:26:95:\n2d:50:ab:bd:97:a9:ea:74:65:89:59:e7:41:03:22:\n0e:91:b3:2b:d5:fc:21:33:13:66:9d:ad:cb:d4:5a:\n6c:32:0e:b4:d2:6b:4b:16:e7:6a:e4:5a:de:01:0e:\ne6:5e:09:95:4b:f2:f4:48:50:40:56:63:b3:15:ff:\n7a:37:54:aa:b6:a6:3f:c8:59:ed:83:5c:45:05:f7:\nce:83\nExponent: 65537 (0x10001)\nX509v3 extensions:\nX509v3 Basic Constraints:\nCA:FALSE\nX509v3 Subject Key Identifier:\nD1:CA:3C:6A:99:94:54:25:0C:DD:2D:EE:FD:A3:D0:E6:50:34:05:15\nX509v3 Authority Key Identifier:\nkeyid:A1:C8:55:99:41:23:26:28:D7:22:A0:05:75:8F:72:E2:3A:89:43:FA\nDirName:/CN=ct-ca.statseeker.com\nserial:7A:06:C0:BB:E5:A3:D8:AC:AC:8F:F9:55:6D:A8:1B:B6:8B:D1:6A:44\nX509v3 Extended Key Usage:\nTLS Web Client Authentication\nX509v3 Key Usage:\nDigital Signature\nSignature Algorithm: sha256WithRSAEncryption\nSignature Value:\n4e:69:be:6c:c4:71:e1:70:bd:6e:82:12:bf:c9:3a:2d:3c:28:\n1b:5f:95:90:a6:28:2a:b5:f4:74:63:5a:fc:47:85:15:2a:7f:\nb9:1a:7b:79:3c:2d:7c:ce:72:1c:c5:9f:61:cd:ec:81:58:c0:\n53:0c:a3:6b:33:19:48:01:68:2c:2c:79:d7:3d:c6:ef:e8:da:\n52:94:66:ac:23:d0:2c:43:2c:0a:6a:08:86:14:77:28:c0:44:\n48:e3:c2:ee:10:49:eb:1c:c7:ca:9f:ff:71:fd:0f:35:bb:80:\n1c:f5:98:7d:d5:5b:b1:40:29:4e:4f:57:09:ed:2b:23:c4:06:\n4b:47:f8:0f:cd:31:47:91:73:e7:6a:9e:73:78:f2:20:70:1f:\n78:27:cd:e6:d2:f4:0a:02:5c:fa:9f:12:5c:86:0b:43:48:11:\n4f:bf:24:1e:f7:0e:4c:13:38:04:d7:52:e8:3a:e6:4f:80:f7:\n80:62:aa:e1:f9:1f:5d:6e:ed:1b:30:15:16:99:ce:df:5b:85:\naa:8e:e3:2d:c4:29:ad:3c:bb:18:19:00:5f:1d:a7:60:88:8e:\nc3:a0:17:52:91:e4:ea:38:1a:45:76:bd:3c:0a:27:3e:70:9a:\n3c:b4:5d:c8:47:63:aa:7d:04:2f:3c:77:3c:78:57:ca:09:5e:\n69:9e:46:15\n-----BEGIN CERTIFICATE-----\nMIIDcDCCAligAwIBAgIRAP42T48I7sVmEhxxjuZUW6owDQYJKoZIhvcNAQELBQAw\nHzEdMBsGA1UEAwwUY3QtY2Euc3RhdHNlZWtlci5jb20wHhcNMjUwNDA3MTIxOTUz\nWhcNMjcwNzExMTIxOTUzWjAaMRgwFgYDVQQDDA9qcGItdGVzdC1jbGllbnQwggEi\nMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCkUD2fhayl3LdE8H/5LX0lCfbU\n4I8V5Vi2GIh4Ik1K8S6yINUSsoIQCQ59cgDukZdvbLgB0FR/xOwN/Xqk0ORgT7UY\n9jZI/fHZScNylPpP9ckr74x0Vkz4PqR+M6AcyuD9fJaPZgswIKAiETk+defw6GMo\nWLg5UZhDH9I3e3XHf3Z6RNT9xmXMJbKGiyGC5pD6tbMF7e7N8Cag+ET35vBoAUZ1\nyRwbtALX0GRFWdJczHcmlS1Qq72Xqep0ZYlZ50EDIg6RsyvV/CEzE2adrcvUWmwy\nDrTSa0sW52rkWt4BDuZeCZVL8vRIUEBWY7MV/3o3VKq2pj/IWe2DXEUF986DAgMB\nAAGjgaswgagwCQYDVR0TBAIwADAdBgNVHQ4EFgQU0co8apmUVCUM3S3u/aPQ5lA0\nBRUwWgYDVR0jBFMwUYAUochVmUEjJijXIqAFdY9y4jqJQ/qhI6QhMB8xHTAbBgNV\nBAMMFGN0LWNhLnN0YXRzZWVrZXIuY29tghR6BsC75aPYrKyP+VVtqBu2i9FqRDAT\nBgNVHSUEDDAKBggrBgEFBQcDAjALBgNVHQ8EBAMCB4AwDQYJKoZIhvcNAQELBQAD\nggEBAE5pvmzEceFwvW6CEr/JOi08KBtflZCmKCq19HRjWvxHhRUqf7kae3k8LXzO\nchzFn2HN7IFYwFMMo2szGUgBaCwsedc9xu/o2lKUZqwj0CxDLApqCIYUdyjAREjj\nwu4QSescx8qf/3H9DzW7gBz1mH3VW7FAKU5PVwntKyPEBktH+A/NMUeRc+dqnnN4\n8iBwH3gnzebS9AoCXPqfElyGC0NIEU+/JB73DkwTOATXUug65k+A94BiquH5H11u\n7RswFRaZzt9bhaqO4y3EKa08uxgZAF8dp2CIjsOgF1KR5Oo4GkV2vTwKJz5wmjy0\nXchHY6p9BC88dzx4V8oJXmmeRhU=\n-----END CERTIFICATE-----\n\n',
               client_key: 'set',
            },
         ],
         success: true,
      },
      { status: 200 }
   );
}

export async function getNoCertificates() {
   return HttpResponse.json(
      {
         meta: {},
         result: [{ client_cert: '', client_key: 'unset' }],
         success: true,
      },
      { status: 200 }
   );
}
