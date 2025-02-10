package com.pulumi;

import java.nio.file.Paths;

import com.pulumi.automation.*;

public class App {
    public static void main(String[] args) {
        var stackName = "dev";
        var workingDir = Paths.get("..", "website");

        var destroy = args.length > 0 && args[0].equals("destroy");
        try (var stack = LocalWorkspace.createOrSelectStack(stackName, workingDir)) {

            System.out.println("Successfully initialized stack");

            // Set AWS region
            System.out.println("Setting up config...");
            stack.setConfig("aws:region", new ConfigValue("us-west-2"));
            System.out.println("Config set");

            // Refresh stack
            System.out.println("Refreshing stack...");
            stack.refresh(RefreshOptions.builder().onStandardOutput(System.out::println).build());
            System.out.println("Refresh complete");

            if (destroy) {
                System.out.println("Destroying stack...");
                stack.destroy(DestroyOptions.builder().onStandardOutput(System.out::println).build());
                System.out.println("Stack destroy complete");
            } else {
                System.out.println("Updating stack...");
                var result = stack.up(UpOptions.builder().onStandardOutput(System.out::println).build());

                var changes = result.summary().resourceChanges();
                if (!changes.isEmpty()) {
                    System.out.println("Update summary:");
                    changes.forEach((key, value) -> System.out.printf("    %s: %d%n", key, value));
                }

                System.out.println("Website URL: " + result.outputs().get("website_url").value());
            }
        } catch (Exception ex) {
            // Print the exception message
            System.err.println("An exception occured while running the inline Pulumi program: " + ex.getMessage());

            System.err.print("Stack trace: ");
            ex.printStackTrace();
        }
    }
}