import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Login {
    private static final Map<String, String> users = new HashMap<>();

    static {
        // Initialize with some default users for testing
        users.put("admin", "admin123");
        users.put("user", "password");
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("=== Login System ===");
        System.out.print("Enter username: ");
        String username = scanner.nextLine();
        
        System.out.print("Enter password: ");
        String password = scanner.nextLine();
        
        if (authenticate(username, password)) {
            System.out.println("Login successful! Welcome, " + username);
        } else {
            System.out.println("Login failed! Invalid username or password.");
        }
        
        scanner.close();
    }

    public static boolean authenticate(String username, String password) {
        if (username == null || password == null) {
            return false;
        }
        return users.containsKey(username) && users.get(username).equals(password);
    }

    public static void addUser(String username, String password) {
        if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
            users.put(username, password);
        }
    }
}
