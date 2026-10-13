import java.util.Scanner;

public class Calculator {

    public static double add(double a, double b) {
        return a + b;
    }

    public static double subtract(double a, double b) {
        return a - b;
    }

    public static double multiply(double a, double b) {
        return a * b;
    }

    public static double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Simple Java Calculator ===");
        System.out.println("Select operation (+, -, *, /): ");
        char operator = scanner.next().charAt(0);

        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();

        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();

        double result;
        switch (operator) {
            case '+':
                result = add(num1, num2);
                System.out.printf("Result: %f + %f = %f%n", num1, num2, result);
                break;
            case '-':
                result = subtract(num1, num2);
                System.out.printf("Result: %f - %f = %f%n", num1, num2, result);
                break;
            case '*':
                result = multiply(num1, num2);
                System.out.printf("Result: %f * %f = %f%n", num1, num2, result);
                break;
            case '/':
                if (num2 == 0) {
                    System.out.println("Error: Division by zero is not allowed.");
                } else {
                    result = divide(num1, num2);
                    System.out.printf("Result: %f / %f = %f%n", num1, num2, result);
                }
                break;
            default:
                System.out.println("Error: Invalid operator.");
                break;
        }

        scanner.close();
    }
}
