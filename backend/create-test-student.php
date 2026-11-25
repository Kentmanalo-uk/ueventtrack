<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Student;
use Illuminate\Support\Facades\Hash;

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

echo "✓ Test student created successfully!\n";
echo "Email: {$student->email}\n";
echo "Password: password\n";
echo "Student ID: {$student->student_id}\n";
