/*
  # Set up authentication users

  1. Create Users
    - Create two users with specific credentials
    - Set up authentication policies
*/

-- Create users with specific credentials
DO $$
BEGIN
  -- Create "My Bubble" user
  PERFORM auth.create_user(
    uid := gen_random_uuid(),
    email := 'mybubble@example.com',
    password := 'LordIfIt''sYourWillGetUsMarriedSoon',
    email_confirm := true
  );

  -- Create "My HeartBeat" user
  PERFORM auth.create_user(
    uid := gen_random_uuid(),
    email := 'myheartbeat@example.com',
    password := 'LordIfIt''sYourWillGetUsMarriedSoon',
    email_confirm := true
  );
END $$;