# crytter

distributed peer to peer social networking feeds

This module uses [append-only](https://github.com/Raynos/append-only)
which uses
[scuttlebutt](https://github.com/dominictarr/scuttlebutt)
so you can make posts to your feed offline or while only connected to some
subset of your followers and when you come back your feeds will be integrated in
an eventually consistent ordering across all nodes.

# example

Start the server on port 5000:

```
$ crytter 5000
```

then start another server on 5001 to replicate with the first:

```
$ crytter 5001 http://localhost:5000/replicate
```

Then send POSTs to either server:

```
$ curl -X POST -d 'beep boop' localhost:5000/freddeth
$ curl -X POST -d 'doom' localhost:5000/maccery
$ curl -X POST -d 'oh hello' localhost:5000/maccery
```

and watch the feeds replicate in realtime:

```
# freddeth{F69D44EBFCED52F8CE326E98}               1353913432877
  beep boop
# maccery{F69D44EBFCED52F8CE326E98}                1353913449838
  doom
# maccery{C399719DCEE9CDB9A5B170F8}                1353913458680
  oh hello.
```

# todo

These commands should eventually be implemented, along with public key
encryption and signing:

```
crytter relay MESSAGE {--ring RINGNAME | --name NAME}
crytter upload FILENAME {--ring RINGNAME | --name NAME}
crytter search  QUERY {--ring RINGNAME | --name NAME}

crytter user add NAME PUBKEY
crytter user search NAME
crytter user list

crytter ring add RINGNAME
crytter ring rm RINGNAME
crytter ring list
crytter ring useradd NAME RINGNAME {-r|-w}
crytter ring usermod NAME RINGNAME {-r|-w}
crytter ring userdel NAME RINGNAME
crytter ring userlist RINGNAME

crytter profile generate NAME
crytter profile add NAME PUBKEY PRIVKEY
crytter profile rm NAME
crytter profile list

crytter config set network-quota VALUE {--ring RINGNAME | --name NAME}
crytter config set storage-quota VALUE {--ring RINGNAME | --name NAME}
crytter config get KEY VALUE {--ring RINGNAME | --name NAME}
crytter config list {--ring RINGNAME | --name NAME}

crytter peer add HOSTNAME
crytter peer rm HOSTNAME
crytter peer list
```

# install

To get the `crytter` command, with [npm](https://npmjs.org) do:

```
npm install -g crytter
```

# license

MIT
