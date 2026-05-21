# PowerShell test helper for API endpoints
$base = 'http://localhost:8081'

# Test cities list
Write-Host "GET $base/api/cities"
Invoke-RestMethod -Uri "$base/api/cities" -Method Get | ConvertTo-Json -Depth 4 | Write-Host

# Test price endpoint
$priceBody = @{ sourceId = '1'; destinationId = '2'; type = 'TRAIN' }
$priceJson = $priceBody | ConvertTo-Json -Depth 3
Write-Host "POST $base/api/cities/price - Body:`n$priceJson"
Invoke-RestMethod -Uri "$base/api/cities/price" -Method Post -Body $priceJson -ContentType 'application/json' | ConvertTo-Json -Depth 5 | Write-Host

# Test booking endpoint
$bookingBody = @{ type='TRAIN'; source='New Delhi'; destination='Mumbai'; date='2026-06-01'; userEmail='test@example.com'; price=100; passengerName='Test'; passengerAge=30 }
$bookingJson = $bookingBody | ConvertTo-Json -Depth 5
Write-Host "POST $base/api/bookings/book - Body:`n$bookingJson"
Invoke-RestMethod -Uri "$base/api/bookings/book" -Method Post -Body $bookingJson -ContentType 'application/json' | ConvertTo-Json -Depth 5 | Write-Host
