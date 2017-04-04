package groovejames.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

public class FileUtils {

    public static boolean isEmptyDirectory(File dir) {
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            return files != null && files.length == 0;
        }
        return false;
    }

    /**
     * Deletes a file, never throwing an exception.
     * If file is a directory, delete it and all sub-directories.
     * <p/>
     * The difference between File.delete() and this method are:
     * <ul>
     * <li>A directory to be deleted does not have to be empty.</li>
     * <li>No exceptions are thrown when a file or directory cannot be deleted.</li>
     * </ul>
     *
     * @param file file or directory to delete, can be <code>null</code>
     * @return <code>true</code> if the file or directory was deleted, otherwise
     * <code>false</code>
     */
    public static boolean deleteQuietly(File file) {
        if (file == null) {
            return false;
        }
        try {
            if (file.isDirectory()) {
                cleanDirectory(file);
            }
        } catch (Exception ignore) {
            // intentionally ignored
        }
        try {
            return file.delete();
        } catch (Exception ignore) {
            return false;
        }
    }

    /**
     * Cleans a directory without deleting it.
     *
     * @param directory directory to clean
     * @throws IOException in case cleaning is unsuccessful
     */
    public static void cleanDirectory(File directory) throws IOException {
        if (!directory.exists()) {
            throw new IllegalArgumentException(directory + " does not exist");
        }

        if (!directory.isDirectory()) {
            throw new IllegalArgumentException(directory + " is not a directory");
        }

        File[] files = directory.listFiles();
        if (files == null) {  // null if security restricted
            throw new IOException("Failed to list contents of " + directory);
        }

        IOException exception = null;
        for (File file : files) {
            try {
                forceDelete(file);
            } catch (IOException ioe) {
                exception = ioe;
            }
        }

        if (null != exception) {
            throw exception;
        }
    }

    /**
     * Deletes a directory recursively.
     *
     * @param directory directory to delete
     * @throws IOException in case deletion is unsuccessful
     */
    public static void deleteDirectory(File directory) throws IOException {
        if (!directory.exists()) {
            return;
        }
        cleanDirectory(directory);
        if (!directory.delete()) {
            throw new IOException("Unable to delete directory: " + directory);
        }
    }

    /**
     * Deletes a file. If file is a directory, delete it and all sub-directories.
     * <p/>
     * The difference between File.delete() and this method are:
     * <ul>
     * <li>A directory to be deleted does not have to be empty.</li>
     * <li>You get exceptions when a file or directory cannot be deleted.
     * (java.io.File methods returns a boolean)</li>
     * </ul>
     *
     * @param file file or directory to delete, must not be <code>null</code>
     * @throws NullPointerException  if the directory is <code>null</code>
     * @throws FileNotFoundException if the file was not found
     * @throws IOException           in case deletion is unsuccessful
     */
    public static void forceDelete(File file) throws IOException {
        if (file.isDirectory()) {
            deleteDirectory(file);
        } else {
            boolean filePresent = file.exists();
            if (!file.delete()) {
                if (!filePresent) {
                    throw new FileNotFoundException("File does not exist: " + file);
                }
                throw new IOException("Unable to delete file: " + file);
            }
        }
    }

    /**
     * Ensure that every part of the given file path is not longer that 240 chars
     *
     * @param filepath a
     */
    public static String sanitizeFilepath(String filepath) {
        String[] parts = filepath.split("/");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            if (i > 0) sb.append("/");
            String part = parts[i];
            sb.append(truncateFilenamePart(part));
        }
        return sb.toString();
    }

    private static String truncateFilenamePart(String part) {
        return part.length() > 240 ? part.substring(0, 240) : part;
    }

}
