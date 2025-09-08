-- Insert default subscription plans
insert into public.subscription_plans (name, description, price_monthly, price_yearly, features, sort_order) values
('Free', 'Access to basic content and community', 0.00, 0.00, '["Basic blog access", "Community forum", "Newsletter"]', 1),
('Member', 'Enhanced learning experience with premium content', 9.99, 99.99, '["All Free features", "Premium articles", "Basic AI recommendations", "Priority support"]', 2),
('Premium', 'Complete access to all features and personalized AI coaching', 19.99, 199.99, '["All Member features", "Full AI Language-Lab access", "Personalized learning paths", "1-on-1 coaching sessions", "Early access to new content"]', 3);

-- Insert default categories
insert into public.categories (name, slug, description, color, language) values
('Medical Education', 'medical-education', 'Educational content for medical professionals', '#ef4444', 'en'),
('Trauma Surgery', 'trauma-surgery', 'Specialized trauma and orthopedic surgery content', '#f97316', 'en'),
('Research', 'research', 'Latest research and clinical studies', '#3b82f6', 'en'),
('Technology', 'technology', 'Medical technology and innovations', '#8b5cf6', 'en'),
('Career Development', 'career-development', 'Professional development and career guidance', '#10b981', 'en');

-- Insert German categories
insert into public.categories (name, slug, description, color, language) values
('Medizinische Ausbildung', 'medizinische-ausbildung', 'Bildungsinhalte für medizinische Fachkräfte', '#ef4444', 'de'),
('Traumachirurgie', 'traumachirurgie', 'Spezialisierte Trauma- und Orthopädiechirurgie', '#f97316', 'de'),
('Forschung', 'forschung', 'Neueste Forschung und klinische Studien', '#3b82f6', 'de'),
('Technologie', 'technologie', 'Medizinische Technologie und Innovationen', '#8b5cf6', 'de'),
('Karriereentwicklung', 'karriereentwicklung', 'Berufliche Entwicklung und Karriereberatung', '#10b981', 'de');

-- Insert default tags
insert into public.tags (name, slug, language) values
('orthopedics', 'orthopedics', 'en'),
('trauma', 'trauma', 'en'),
('surgery', 'surgery', 'en'),
('education', 'education', 'en'),
('research', 'research', 'en'),
('technology', 'technology', 'en'),
('ai', 'ai', 'en'),
('learning', 'learning', 'en');

-- Insert German tags
insert into public.tags (name, slug, language) values
('orthopädie', 'orthopadie', 'de'),
('trauma', 'trauma', 'de'),
('chirurgie', 'chirurgie', 'de'),
('bildung', 'bildung', 'de'),
('forschung', 'forschung', 'de'),
('technologie', 'technologie', 'de'),
('ki', 'ki', 'de'),
('lernen', 'lernen', 'de');

-- Insert sample learning paths
insert into public.learning_paths (title, description, difficulty_level, estimated_duration, language) values
('Introduction to Trauma Surgery', 'Comprehensive introduction to trauma surgery principles and practices', 'beginner', 20, 'en'),
('Advanced Orthopedic Techniques', 'Advanced surgical techniques and case studies', 'advanced', 40, 'en'),
('Medical AI and Technology', 'Understanding AI applications in modern medicine', 'intermediate', 15, 'en');

-- Insert German learning paths
insert into public.learning_paths (title, description, difficulty_level, estimated_duration, language) values
('Einführung in die Traumachirurgie', 'Umfassende Einführung in die Prinzipien und Praktiken der Traumachirurgie', 'beginner', 20, 'de'),
('Fortgeschrittene Orthopädische Techniken', 'Fortgeschrittene chirurgische Techniken und Fallstudien', 'advanced', 40, 'de'),
('Medizinische KI und Technologie', 'KI-Anwendungen in der modernen Medizin verstehen', 'intermediate', 15, 'de');
