reader/writer 

public class FileIOExample {
    public static void main(String[] args) {
        String inputFilePath = "input.txt";  // Путь к входному файлу
        String outputFilePath = "output.txt"; // Путь к выходному файлу

        // Чтение из файла
        try (BufferedReader reader = new BufferedReader(new FileReader(inputFilePath))) {
            String line;
            StringBuilder content = new StringBuilder();

            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n"); // Добавляем строку в содержимое
            }

            System.out.println("Содержимое файла:");
            System.out.println(content.toString());

        } catch (IOException e) {
            System.err.println("Ошибка при чтении файла: " + e.getMessage());
        }

        // Запись в файл
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilePath))) {
            writer.write("Это пример записи в файл.\n");
            writer.write("Java I/O очень удобно использовать!\n");
            System.out.println("Данные успешно записаны в файл: " + outputFilePath);
        } catch (IOException e) {
            System.err.println("Ошибка при записи в файл: " + e.getMessage());
        }
    }
}

массив байт
import java.io.*;

public class FileIOExample {
    public static void main(String[] args) {
        String inputFilePath = "input.txt";  // Путь к входному файлу
        String outputFilePath = "output.txt"; // Путь к выходному файлу

        // Чтение из файла как массива байт
        try (FileInputStream fis = new FileInputStream(inputFilePath)) {
            byte[] fileContent = new byte[fis.available()];
            int bytesRead = fis.read(fileContent);

            System.out.println("Содержимое файла (в байтах):");
            for (byte b : fileContent) {
                System.out.print((char) b);
            }
            System.out.println();

        } catch (IOException e) {
            System.err.println("Ошибка при чтении файла: " + e.getMessage());
        }

        // Запись данных в файл
        try (FileOutputStream fos = new FileOutputStream(outputFilePath)) {
            String data = "Это пример записи в файл.\nJava I/O очень удобно использовать!\n";
            fos.write(data.getBytes());
            System.out.println("Данные успешно записаны в файл: " + outputFilePath);
        } catch (IOException e) {
            System.err.println("Ошибка при записи в файл: " + e.getMessage());
        }
    }
}