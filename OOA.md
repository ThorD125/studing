# OOA

## Gradle.build
```
plugins {
    id 'java'
    id 'application'
    id 'org.openjfx.javafxplugin' version '0.0.10'
}

application {
    mainClass = 'School.ui.StartUp'
}

javafx {
    version = "18"
    modules = [ 'javafx.controls', 'javafx.fxml']
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1'
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1'
    implementation group: 'mysql', name: 'mysql-connector-java', version: '8.0.30'
    implementation "io.vertx:vertx-core:4.3.4"
    implementation "io.vertx:vertx-web-client:4.3.4"
    testImplementation "io.vertx:vertx-junit5:4.3.4"
    testImplementation "io.vertx:vertx-web-client:4.3.4"
    testImplementation 'com.squareup.okhttp3:mockwebserver:4.10.0'
    // https://mvnrepository.com/artifact/org.mindrot/jbcrypt
    implementation group: 'org.mindrot', name: 'jbcrypt', version: '0.4'
    // https://mvnrepository.com/artifact/org.jasypt/jasypt
    implementation group: 'org.jasypt', name: 'jasypt', version: '1.9.3'

}

test {
    useJUnitPlatform()
}
```

Change:  the mainClass = `'School.ui.StartUp'`

## Config
> in `resources/config` => config.properties file
```java
public class Config {
    private static final String CONFIG_FILE = "/config/config.properties";
    private static final Config INSTANCE = new Config();
    private Properties properties = new Properties();
    private static final Logger LOGGER = Logger.getLogger(Config.class.getName())
    private Config() {
    try (InputStream ris = getClass().getResourceAsStream(CONFIG_FILE)) {
    properties.load(ris);
    } catch (IOException ex) {
    LOGGER.log(Level.SEVERE,
    "Unable to read config file", ex);
    throw new PropException("Unable to load configuration.");
    }
}
public static Config getInstance() {
    return INSTANCE;
}

public String readSetting(String key, String defaultValue) {
    return properties.getProperty(key, defaultValue);
}
public String readSetting(String key) {
    return readSetting(key, null);
}
public void writeSetting(String key, String value) {
    properties.setProperty(key, value);
    storeSettingsToFile();
}

private void storeSettingsToFile() {
String path = getClass().getResource(CONFIG_FILE).getPath();
try (FileOutputStream fos = new FileOutputStream(path)) {
properties.store(fos, null);
} catch (IOException | NullPointerException ex) {
LOGGER.log(Level.SEVERE,
"Unable to write config file", ex);
throw new PropException("Unable to save configuration.");
}
}
}
```

## FXML
### controller

> import the fxml file into scenebuilder and get code example

### Startup:
``` java
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.net.URL;

public class StartUp extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        URL url = getClass().getResource("/fxml/NAME.fxml");
        ResourceBundle bundle = ResourceBundle.getBundle("NAME");
        Parent root = FXMLLoader.load(url, bundle);

        Scene scene = new Scene(root);

        primaryStage.setScene(scene);
        primaryStage.show();
    }
}
```

## Database connector
jdbc:mysql://localhost/exam_movies !!!!!!!!!!!!!!!!
```java
public class MySqlConnection {
private static final String KEY_DB_URL = "db.url";
private static final String KEY_DB_USERNAME = "db.username";
private static final String KEY_DB_PASSWORD = "db.password"; // NOSONAR
private static final String url;
private static final String username;
private static final String password;
static {
String usernameEncrypted = Config.getInstance().readSetting(KEY_DB_USERNAME);
String passwordEncrypted = Config.getInstance().readSetting(KEY_DB_PASSWORD);
Crypto crypto = Crypto.getInstance();
username = crypto.decrypt(usernameEncrypted);
password = crypto.decrypt(passwordEncrypted);
url = Config.getInstance().readSetting(KEY_DB_URL);
}
private MySqlConnection() {
}
public static Connection getConnection() throws SQLException {
return DriverManager.getConnection(url, username, password);
}
```

## Encryption

```java
public class Crypto {
private static final String KEY = "HELLO-FROM-HOWEST";
private static final Crypto INSTANCE = new Crypto();
private StrongTextEncryptor encryptor = new StrongTextEncryptor();
private Crypto() { encryptor.setPassword(KEY); }
public static Crypto getInstance() { return INSTANCE; }
public String encrypt(String in) { return encryptor.encrypt(in); }
public String decrypt(String in) { return encryptor.decrypt(in); }
}
```

## hashing

```java 
String password = in.nextLine(); // get from user
if (BCrypt.checkpw(password, hash)) {
// welcome
}
```

## Example client

```java
package be.howest.ti.chat.client;

import be.howest.ti.chat.server.ClientIdentifier;
import be.howest.ti.chat.shared.*;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.function.Consumer;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ChatClientService implements MessageHandler {

    private static final Logger LOGGER = Logger.getLogger(ChatClientService.class.getName());


    private final String host;
    private final int port;
    private ObjectOutputStream out;
    private Set<Consumer<ChatMessage>> messageReceivedListeners =new HashSet<>();
    private Set<Consumer<List<String>>> userListUpdateListeners =new HashSet<>();

    public ChatClientService(String host, int port) {
        this.host = host;
        this.port = port;
    }



    public void run() {
        try {
            LOGGER.log(Level.INFO, "Trying to connect ...");
            Socket socket = new Socket(host, port);
            LOGGER.log(Level.INFO, "Connected");
            ObjectInputStream in = new ObjectInputStream(socket.getInputStream());

            new Thread(()->{
                while(true) {
                    try {
                        Message msg = (Message) in.readObject();
                        LOGGER.log(Level.INFO, "New message on client: {0}", msg);

                        msg.accept(null, this);

                    } catch (IOException | ClassNotFoundException ex) {

                        LOGGER.log(Level.INFO, "Something went wrong while reading a message from the server", ex);
                    }
                }
            }).start();

            out = new ObjectOutputStream(socket.getOutputStream());

        } catch (IOException ex) {
            LOGGER.log(Level.INFO, "Something went wrong in the client", ex);
        }
    }

    public void send(String receiver, String msg) {
        LOGGER.log(Level.INFO, "Sending: {0} to {1}", new Object[]{msg,receiver});
        try {
            ChatMessage msgObject = new ChatMessage(msg);
            msgObject.setReceiver(receiver);
            out.writeObject(msgObject);
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Failed to send message");
        }
    }

    public void addMessageReceivedListener(Consumer<ChatMessage> listener) {
        this.messageReceivedListeners.add(listener);

    }

    public void changeName(String newName) {
        LOGGER.log(Level.INFO, "Chane name to {0}", newName);
        try {
            out.writeObject(new SetNickMessage(newName));
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Failed to send message");
        }
    }

    @Override
    public void handleSetNickMessage(ClientIdentifier sender, SetNickMessage message) {
        throw new UnsupportedOperationException("Server learn your protocol.");
    }

    @Override
    public void handleChatMessage(ClientIdentifier sender, ChatMessage message) {
        messageReceivedListeners.forEach(listener -> listener.accept(message));
    }

    @Override
    public void handleUserListMessage(ClientIdentifier sender, UserListMessage message) {
        userListUpdateListeners.forEach(listener->listener.accept(message.getUsers()));
    }

    public void addUserListUpdateListener(Consumer<List<String>> listener) {
        userListUpdateListeners.add(listener);
    }
}

```

## Example Server

```java
package be.howest.ti.chat.server;

import be.howest.ti.chat.shared.*;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class ChatServerService implements MessageHandler {

    private static final Logger LOGGER = Logger.getLogger(ChatServerService.class.getName());
    public static final int PORT = 12345;
    private boolean running;


    public static void main(String[] args) {
        ChatServerService server = new ChatServerService();
        server.run();

        //if (new Random().nextInt(1)>1000) {server.stop();} //MDW not smart enough for compiler.
    }

    public void stop() {
        running = false;
    }

    void run() {
        LOGGER.log(Level.INFO, "Server running ...");
        running = true;
        try {
            ServerSocket serverSocket = new ServerSocket(PORT);
            int nr = 0;
            while (running) {
                LOGGER.log(Level.INFO, "Waiting for connection ...");
                Socket socket = serverSocket.accept();
                final int connectionNr = nr++;
                new Thread(() -> {
                    this.handleConnection(socket, connectionNr);
                }).start();
            }
            LOGGER.log(Level.INFO, "Shutting down server");
        } catch (IOException ex) {
            LOGGER.log(Level.SEVERE, "Something went wrong in the server", ex);
        }
    }

    private final Map<ClientIdentifier, ObjectOutputStream> connections = new HashMap<>();

    private void handleConnection(Socket socket, int id) {
        try {
            LOGGER.log(Level.INFO, "Connection received");
            ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
            ClientIdentifier client = new ClientIdentifier(id);
            connections.put(client, out);
            broadcastUserList();
            broadcast(new ChatMessage("<server>", "Hello Client " + id));

            ObjectInputStream in = new ObjectInputStream(socket.getInputStream());
            while (true) {
                readIncomingMessages(client, in);
            }

        } catch (IOException ex) {
            LOGGER.log(Level.SEVERE, "Something went wrong in a connection", ex);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    private void readIncomingMessages(ClientIdentifier client, ObjectInputStream in) throws IOException, ClassNotFoundException {
        Message incomingMessage = (Message) in.readObject();
        LOGGER.log(Level.INFO, "Incoming message: from {0}: {1}", new Object[]{
                client,
                incomingMessage
        });

        incomingMessage.accept(client, this);
    }

    private void unicast(ClientIdentifier receiver, Message message) {
        ObjectOutputStream out = connections.get(receiver);
        try {
            out.writeObject(message);
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Failed to send message", e);
        }
    }

    private void broadcast(ChatMessage msg) {
        connections.keySet().stream()
                .filter(client -> !client.getName().equals(msg.getSender()))
                .forEach(client->unicast(client, msg));
    }


    @Override
    public void handleSetNickMessage(ClientIdentifier sender, SetNickMessage message) {
        sender.setName(message.getName());
        broadcastUserList();
    }

    private void broadcastUserList() {
        UserListMessage message = new UserListMessage(
                connections.keySet().stream()
                .map(ClientIdentifier::getName)
                        .collect(Collectors.toList())
        );

        connections.values().forEach(out->{
            try {
                out.writeObject(message);
            } catch (IOException e) {
                LOGGER.log(Level.WARNING, "Failed to send message", e);
            }
        });
    }

    @Override
    public void handleChatMessage(ClientIdentifier sender, ChatMessage message) {
        message.setSender(sender.getName());

        String receiver = message.getReceiver();
        if (receiver.equals("ALL")) {
            broadcast(message);
        } else {
            unicast(receiver, message);
        }

    }

    @Override
    public void handleUserListMessage(ClientIdentifier sender, UserListMessage message) {
        throw new UnsupportedOperationException("Server does not supper this message.");
    }

    private void unicast(String receiver, ChatMessage message) {
        ObjectOutputStream out = connections.keySet().stream()
                .filter(client->client.getName().equals(receiver))
                .findAny()
                .map(connections::get)
                .orElseThrow();
        try {
            out.writeObject(message);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

```

## Logging

```
import java.util.logging.Level;
import java.util.logging.Logger;


private static final Logger LOGGER = Logger.getLogger(*nameOfClass*.class.getName());
```

## Filestream

### Reading a file

```java
try (Scanner s = new Scanner( new File("test.txt") )) {
    while( s.hasNext() ) {
        System.out.println(s.next());
    }
} catch (FileNotFoundException e) {
    // handle it !
}
```

### Writing to a file

```java
try (
    PrintStream ps = new PrintStream(new FileOutputStream(
                new File("test.txt")
        )
)) {
    ps.println("I have so much content!");
} catch (FileNotFoundException e) {
    // handle it !
}
```