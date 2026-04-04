<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Read JSON body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Validate fields
$required = ["studentName", "fatherName", "email", "mobile", "course", "message"];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(["status" => "error", "message" => "$field is required"]);
        exit;
    }
}

$name = $data["studentName"];
$father = $data["fatherName"];
$email = $data["email"];
$mobile = $data["mobile"];
$course = $data["course"];
$messageText = $data["message"];

// ---------------------------------------
// 1️⃣ ADMIN EMAIL USING mail()
// ---------------------------------------
$adminEmail = "webdeveloper@achariya.org";
$subject = "New Admission Enquiry - $name";

$body = "
New Admission Enquiry

Student Name: $name
Father/Guardian: $father
Email: $email
Mobile: $mobile
Course: $course
Message:
$messageText
";

$headers = "From: no-reply@yourdomain.com\r\n";
$headers .= "Reply-To: $email\r\n";

mail($adminEmail, $subject, $body, $headers);

// ---------------------------------------
// 2️⃣ USER CONFIRMATION EMAIL
// ---------------------------------------
$userSubject = "We Received Your Admission Enquiry";
$userBody = "
Hi $name,

Thank you for contacting us regarding: $course

We have received your enquiry and will respond soon.

Regards,
AASC Admissions Team
";

$userHeaders = "From: no-reply@yourdomain.com\r\n";

mail($email, $userSubject, $userBody, $userHeaders);

// ---------------------------------------
// ✔ SUCCESS RESPONSE
// ---------------------------------------

echo json_encode([
    "status" => "success",
    "message" => "Email sent successfully (Google Sheet updated by frontend)."
]);
?>
