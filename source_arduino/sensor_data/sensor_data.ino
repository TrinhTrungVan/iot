#include "DHT.h"
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "ArduinoJson.h"
#include <Wire.h>

#define ssid "TP-Link_3ADE"
#define password "55751667"
#define mqtt_server "192.168.1.104"
const uint16_t mqtt_port = 1883;

#define DHTPIN D6
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

int led = D0; // Đèn cảnh báo
int bell = D1; // Chuông báo động

void setup() {
  Serial.begin(115200);
  Wire.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port); 
  client.setCallback(callback);

  if (!client.connected())
  {
    reconnect();
  }
  client.subscribe("led");
  client.subscribe("bell");
  pinMode(led,OUTPUT);
  pinMode(bell,OUTPUT);
  dht.begin();
}

void setup_wifi()
{
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect()
{
  while (!client.connected()) // Chờ tới khi kết nối
  {
    if (client.connect("TrungVan-ESP8266")){
      Serial.println("Đã kết nối:");
      //đăng kí nhận dữ liệu từ topic
      client.subscribe("led");
      client.subscribe("bell");
    }
    else{
      // in ra trạng thái của client khi không kết nối được với broker
      Serial.print("Lỗi:, rc=");
      Serial.print(client.state());
      Serial.println(" Try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Topic: ");  //in ra tên của topic và nội dung nhận được
  Serial.println(topic);
  char p[length + 1];
  memcpy(p, payload, length);
  p[length] = NULL;
  String message(p);
  if (String(topic) == "led"){
    if (message == "ON"){
      digitalWrite(led, HIGH);
      Serial.print("LED ON ");
    }
    if (message == "OFF"){
      digitalWrite(led, LOW);
      Serial.print("LED OFF ");
    }
  }

  if (String(topic) == "bell"){
    if (message == "ON"){
      digitalWrite(bell, HIGH);
      Serial.print("BELL ON ");
    }
    if (message == "OFF"){
      digitalWrite(bell, LOW);
      Serial.print("BELL OFF ");
    }
  }
  Serial.println(message);
}

void blinkLed(){
  digitalWrite(led, LOW);
  delay(500); 
  digitalWrite(led, HIGH);
  delay(500);  
}

int buttonState = 0;
long last = 0;
void loop() {
  client.loop();
  buttonState = digitalRead(led);
  if (buttonState == HIGH) {
    blinkLed();
  }
  else if (buttonState == LOW) {
    digitalWrite(led, LOW);
  }
  long now = millis();
  if(now - last > 2000){
    last = now;
    int h = dht.readHumidity();
    float t = dht.readTemperature();
    if (isnan(h) || isnan(t)){
       Serial.println("Failed to read from DHT sensor!");
       return;
    }
    
    StaticJsonDocument<100> doc;
    doc["Temperature"] = t;
    doc["Humidity"] = h;
    
    char buffer[100];
    serializeJson(doc, buffer);
    client.publish("temperature-humidity", buffer);
    Serial.print("Data from sensor:");
    Serial.println(buffer);
  }
}
