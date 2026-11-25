<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

// First, create or get the student record
$student = Student::where('email', 'student@test.com')->first();

if (!$student) {
    $student = Student::create([
        'student_id' => '2024-00001',
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'email' => 'student@test.com',
        'password' => Hash::make('password'),
        'course' => 'BSIT',
        'year_level' => 3,
        'barcode' => 'MBC2023-00001',
        'status' => 'active',
    ]);
}

// Now create a User account for mobile login
$user = User::where('email', 'student@test.com')->first();

if (!$user) {
    $user = User::create([
        'name' => $student->first_name . ' ' . $student->last_name,
        'email' => $student->email,
        'password' => $student->password, // Use same password hash
        'role' => 'student',
    ]);
}

echo "✓ Student user account created successfully!\n";
echo "Email: {$user->email}\n";
echo "Password: password\n";
echo "Role: {$user->role}\n";
echo "Student ID: {$student->student_id}\n";
