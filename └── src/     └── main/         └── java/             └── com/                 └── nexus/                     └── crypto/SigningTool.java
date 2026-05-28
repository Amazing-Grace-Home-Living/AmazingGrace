import java.security.KeyPair;
import java.util.Base64;

public class SignatureToolApp {

    public static void main(String[] args) {
        try {
            System.out.println("=== Initializing Digital Signature Tool ===");
            
            // 1. Generate keys
            KeyPair keyPair = DigitalSignatureEngine.generateKeyPair();
            System.out.println("✔ RSA 2048-bit Key Pair generated successfully.");

            // 2. The document text to sign
            String documentContent = "Agreement: Nicholai Maro Madias buys Largo property from IAGG Investments LLC.";
            System.out.println("\nDocument Content:\n\"" + documentContent + "\"");

            // 3. Sign the document
            byte[] digitalSignature = DigitalSignatureEngine.sign(documentContent, keyPair.getPrivate());
            String encodedSignature = Base64.getEncoder().encodeToString(digitalSignature);
            
            System.out.println("\n✔ Digital Signature Created (Base64 Encoded):");
            System.out.println(encodedSignature);

            // 4. Verify the signature (Authentic Case)
            boolean isAuthentic = DigitalSignatureEngine.verify(documentContent, digitalSignature, keyPair.getPublic());
            System.out.println("\nVerification Attempt 1 (Untampered Document): " + (isAuthentic ? "VALID 🟩" : "INVALID 🟥"));

            // 5. Verify the signature (Tampered Case simulation)
            String tamperedContent = documentContent + " Extra malicious clause appended.";
            boolean isStillValid = DigitalSignatureEngine.verify(tamperedContent, digitalSignature, keyPair.getPublic());
            System.out.println("Verification Attempt 2 (Tampered Document): " + (isStillValid ? "VALID 🟩" : "INVALID 🟥"));

        } catch (Exception e) {
            System.err.println("An error occurred during cryptographic operations: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
