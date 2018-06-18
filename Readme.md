
# ipm package: multitech-xdot-integration

## Overview
This is an ipm package, which contains one or more reusable assets within the ipm Community. The 'package.json' in this repo is a ipm spec's package.json, [here](https://docs.clearblade.com/v/3/6-ipm/spec), which is a superset of npm's package.json spec, [here](https://docs.npmjs.com/files/package.json).

[Browse ipm Packages](https://ipm.clearblade.com)

The xDotAdapter included in this package configures the xDot device to operatate in peer-to-peer mode. When in peer-to-peer mode, xDot devices can transmit LoRa payloads to other xDot devices on the same "network". This package, therefore, can only be successfully executed when there are 2 or more xDot devices present.

## Setup
### With ClearBlade Edge
1. Log into your ClearBlade Platform instance and define a ClearBlade Edge for each xDot participating in your network
2. Install and start ClearBlade Edge on the xDot device. 
3. After a minute or two, the xDotAdapter will
4. Configure your constants in the _TwilioConstants_ library.
5. Test using the example service _TwilioExampleSendSMS_.

### Without ClearBlade Edge

## Usage

## Assets
### Devices
* xDotSerialAdapter - This device entry provides the ability for the xDotAdapter to authenticate with the ClearBlade Platform.

### Data Collections
#### adapter_config
This data collection is utilized by the _xDotAdapter_ adapter and the _ReadFromXdot_ code service. The row in this collection contains the adapter name, the MQTT topic root, and settings utilized by the adapter.

##### Columns
* adapter_name - This value __SHOULD NOT__ be modified. The xDotAdapter within this package queries this data collection using __xDotSerialPortAdapter__ as the adapter_name.

* topic_root - This value contains the root of the MQTT topic hierarchy that should be utilized by any artifacts interacting with the xDotAdapter. The current value is __xdot/lora__ and does not need to be modified.

* adapter_settings - This value contains a json object utilized to configure the xDotAdapter. The json schema is as follows:
  * networkAddress
    * A string representing 4 bytes of hex data using a colon (:) to separate each byte from the next byte
    * This value must be identical for all xDot devices within the network
    * Example: "00:11:22:33"
  * networkDataKey
    * A string representing 16 bytes of hex data using a colon (:) to separate each byte from the next byte
    * This value must be identical for all xDot devices within the network
    * Example: "33:22:11:00:33:22:11:00:33:22:11:00:33:22:11:00"
  * networkSessionKey
    * A string representing 16 bytes of hex data using a colon (:) to separate each byte from the next byte
    * This value must be identical for all xDot devices within the network
    * Example: "00:11:22:33:00:11:22:33:00:11:22:33:00:11:22:33"
  * serialPortName
    * A string representing the Linux device path for the serial port used to interact with the xDot device
    * Example: "/dev/ttyAP1"
  * transmissionDataRate
    * A string representing 16 bytes of hex data using a colon (:) to separate each byte from the next byte
    * DR0 - DR15
    * Currently set to "DR8"
  * transmissionFrequency
    * An string representing the transmission frequency used in Peer-to-Peer mode
    * To avoid interference with LoRaWAN networks, use 915.5-919.7 MhZ for US 915 devices and a fixed 869.85 MHz for EU 868 devices.
    * This value must be identical for all xDot devices within the network
    * Currently set to "915500000"

### Adapters
#### xDotSerialAdapter
The xDot adapter provides the ability for the ClearBlade platform to communicate with a MultiTech MultiConnect xDot device (https://www.multitech.com/models/94558032LF). Additional information regarding the adapter can be found at https://github.com/ClearBlade/xDot-Adapter.

The adapter is comprised of the following files:

* deploy.sh  - This file is utilized by the ClearBlade Platform to deploy the adapter to a ClearBlade Edge
* undeploy.sh  - This file is utilized by the ClearBlade Platform to remove/undeploy the adapter from a ClearBlade Edge
* status.sh  - This file is utilized by the ClearBlade Platform to retrieve the status of the adapter running on a ClearBlade Edge
* xDotAdapter.etc.initd  - This file contains an init.d script which is used to install the adapter as an init.d service within mLinux on the xDot device
* xDotAdapter.etc.default  - This file contains default values utilized by the init.d script
* xDotAdapter  - This file is the binary executable

### Code Services
* `ReadFromXdot`  - This code service can be invoked to trigger a request to the xDot to read any incoming LoRa payloads. The request to the xDot is accomplished by publishing to a MQTT topic. The xDotAdapter contained in this package subscribes to the MQTT topic and executes the logic required to read incoming LoRa payloads. This package contains a code timer that will invoke this service every 2 minutes.

### Messaging
The following MQTT messaging topics are utilized within this package:

* {topic_root}/receive/request - This topic is utilized by the _ReadFromXdot_ service to instruct the adapter to retrieve any incoming LoRa payloads from the xDot.
* {topic_root}/receive/response - This topic is utilized by the xDotAdapter adapter service to send incoming LoRa packets back to the ClearBlade Platform/ClearBlade Edge.
* {topic_root}/send/request - This topic should be utilized whenever you wish to instruct the adapter to send/write a payload to the LoRa radio. The payload payload published to this topic is a basic string containing any data you wish to transmit from the LoRa radio.

** Note: topic_root is defined within the adapter_config data collection.

## API
See the messaging topic above in order to interact with the xDotDevice.
