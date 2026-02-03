-- Update Bekzod Aliyev to Abdullayeva Asila Olimovna
-- Find the student with full_name 'Bekzod Aliyev' and update their information

UPDATE students
SET 
    full_name = 'Abdullayeva Asila Olimovna',
    avatar_url = '/kelin.jpg'
WHERE full_name = 'Bekzod Aliyev';
