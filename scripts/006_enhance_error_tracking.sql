-- Enhanced Error Tracking System for Dr. Gulko German Learning Platform

-- Drop existing basic error_log table to recreate with enhanced schema
DROP TABLE IF EXISTS error_log CASCADE;

-- Create enhanced learning_errors table
CREATE TABLE IF NOT EXISTS learning_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  error_type TEXT NOT NULL CHECK (error_type IN ('grammar', 'vocabulary', 'pronunciation', 'medical_terminology')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  context TEXT,
  frequency INTEGER DEFAULT 1,
  last_occurred TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create error_patterns table for analytics
CREATE TABLE IF NOT EXISTS error_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL,
  frequency INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE learning_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_errors
CREATE POLICY "Users can view own errors" ON learning_errors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own errors" ON learning_errors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own errors" ON learning_errors FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for error_patterns
CREATE POLICY "Users can view own patterns" ON error_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own patterns" ON error_patterns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own patterns" ON error_patterns FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_learning_errors_updated_at BEFORE UPDATE ON learning_errors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_error_patterns_updated_at BEFORE UPDATE ON error_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment error frequency
CREATE OR REPLACE FUNCTION increment_error_frequency(
  p_user_id UUID,
  p_error_type TEXT,
  p_category TEXT,
  p_description TEXT,
  p_correct_answer TEXT,
  p_user_answer TEXT,
  p_context TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  existing_error_id UUID;
  new_error_id UUID;
BEGIN
  -- Check if similar error exists (same type, category, and answers)
  SELECT id INTO existing_error_id
  FROM learning_errors
  WHERE user_id = p_user_id
    AND error_type = p_error_type
    AND category = p_category
    AND correct_answer = p_correct_answer
    AND user_answer = p_user_answer
    AND is_resolved = FALSE;

  IF existing_error_id IS NOT NULL THEN
    -- Update existing error
    UPDATE learning_errors
    SET frequency = frequency + 1,
        last_occurred = NOW(),
        updated_at = NOW()
    WHERE id = existing_error_id;
    
    RETURN existing_error_id;
  ELSE
    -- Create new error
    INSERT INTO learning_errors (
      user_id, error_type, category, description,
      correct_answer, user_answer, context
    ) VALUES (
      p_user_id, p_error_type, p_category, p_description,
      p_correct_answer, p_user_answer, p_context
    ) RETURNING id INTO new_error_id;
    
    RETURN new_error_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get error statistics
CREATE OR REPLACE FUNCTION get_error_stats(p_user_id UUID)
RETURNS TABLE (
  total_errors BIGINT,
  resolved_errors BIGINT,
  resolution_rate NUMERIC,
  common_categories JSONB,
  weekly_trend JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_resolved = TRUE) as resolved
    FROM learning_errors
    WHERE user_id = p_user_id
  ),
  categories AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'category', category,
          'count', count,
          'percentage', ROUND((count::NUMERIC / SUM(count) OVER()) * 100, 1)
        ) ORDER BY count DESC
      ) as cat_data
    FROM (
      SELECT category, COUNT(*) as count
      FROM learning_errors
      WHERE user_id = p_user_id
      GROUP BY category
    ) cat_counts
  ),
  weekly AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'week', 'Week ' || week_num,
          'errors', error_count
        ) ORDER BY week_num
      ) as week_data
    FROM (
      SELECT 
        EXTRACT(WEEK FROM created_at) - EXTRACT(WEEK FROM CURRENT_DATE) + 4 as week_num,
        COUNT(*) as error_count
      FROM learning_errors
      WHERE user_id = p_user_id
        AND created_at >= CURRENT_DATE - INTERVAL '4 weeks'
      GROUP BY week_num
      ORDER BY week_num
    ) weekly_counts
  )
  SELECT 
    s.total,
    s.resolved,
    CASE WHEN s.total > 0 THEN ROUND((s.resolved::NUMERIC / s.total) * 100, 1) ELSE 0 END,
    COALESCE(c.cat_data, '[]'::jsonb),
    COALESCE(w.week_data, '[]'::jsonb)
  FROM stats s
  CROSS JOIN categories c
  CROSS JOIN weekly w;
END;
$$ LANGUAGE plpgsql;
