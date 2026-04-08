<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Sertifikat Kelulusan JapanLingo</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin: 0; padding: 50px; background-color: #fce7f3; }
        .certificate-container { border: 10px solid #be123c; padding: 50px; background-color: #ffffff; }
        h1 { color: #9f1239; font-size: 50px; margin-bottom: 10px; }
        h2 { color: #333; font-size: 30px; margin-top: 10px; }
        p { font-size: 20px; color: #555; }
        .name { font-size: 40px; font-weight: bold; text-decoration: underline; color: #000; margin: 20px 0; }
        .footer { margin-top: 50px; font-size: 16px; color: #777; }
        .cert-number { font-size: 14px; text-align: right; color: #999; }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="cert-number">No: {{ $certificate->certificate_number }}</div>
        <h1>JAPANLINGO</h1>
        <h2>CERTIFICATE OF ACHIEVEMENT</h2>
        <p>Sertifikat Ini Diberikan Kepada:</p>
        <div class="name">{{ $user->username ?? $user->name }}</div>
        <p>Atas Keberhasilannya Menyelesaikan Level:</p>
        <h2>{{ $level->level_name ?? 'N/A' }}</h2>
        <p>Diterbitkan pada: {{ $date }}</p>
        
        <div class="footer">
            <p>Teruslah belajar dan pantang menyerah! がんばって (Ganbatte)</p>
        </div>
    </div>
</body>
</html>
