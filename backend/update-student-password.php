<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Student;
use Illuminate\Support\Facades\Hash;

$student = Student::where('email', 'student@test.com')->first();

if ($student) {
    $student->password = Hash::make('password');
    $student->save();
    echo "✓ Password updated for: {$student->email}\n";
    echo "Email: {$student->email}\n";
    echo "Password: password\n";
} else {
    echo "✗ Student not found\n";
}
