import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'edge';

const colors = {
  primary: '#8B5CF6',
  secondary: '#3B82F6', 
  accent: '#10B981',
  dark: '#1F2937',
  light: '#F9FAFB'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response('Missing userId', { status: 400 });
    }

    // Fetch developer data
    const supabase = createServerClient();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, developer_profiles(*)')
      .eq('id', userId)
      .single();

    const { data: skills } = await supabase
      .from('user_skills')
      .select('skills(name), proficiency_level, years_of_experience, validated_via_github')
      .eq('user_id', userId)
      .order('proficiency_level', { ascending: false })
      .limit(6);

    const { data: githubStats } = await supabase
      .from('github_profiles')
      .select('total_repos, total_stars, contributions_last_year')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      return new Response('Developer not found', { status: 404 });
    }

    // Generate the card
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.dark,
            backgroundImage: `linear-gradient(135deg, ${colors.dark} 0%, #111827 100%)`,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -150,
              left: -150,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
            }}
          />

          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              height: '85%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 48,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: 'white',
                  marginRight: 32,
                  boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)',
                }}
              >
                {profile.name?.charAt(0).toUpperCase()}
              </div>

              {/* Name and Title */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h1
                  style={{
                    fontSize: 42,
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  {profile.name}
                </h1>
                <p
                  style={{
                    fontSize: 24,
                    color: colors.accent,
                    margin: 0,
                    fontWeight: '500',
                  }}
                >
                  {profile.developer_profiles?.headline || 'Full Stack Developer'}
                </p>
                <p
                  style={{
                    fontSize: 18,
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: 0,
                    marginTop: 8,
                  }}
                >
                  {profile.developer_profiles?.experience_years || 0}+ years experience
                </p>
              </div>

              {/* Chosn Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    borderRadius: 8,
                    marginRight: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  C
                </div>
                <span style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                  Verified on Chosn
                </span>
              </div>
            </div>

            {/* Skills Grid */}
            <div style={{ marginBottom: 32 }}>
              <h3
                style={{
                  fontSize: 20,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: 16,
                  fontWeight: '600',
                }}
              >
                Top Skills (GitHub Validated)
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                {skills?.map((skill: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: skill.validated_via_github 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      padding: '10px 20px',
                      borderRadius: 100,
                      border: skill.validated_via_github
                        ? '1px solid rgba(16, 185, 129, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <span
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '500',
                        marginRight: 8,
                      }}
                    >
                      {skill.skills.name}
                    </span>
                    {skill.validated_via_github && (
                      <span
                        style={{
                          fontSize: 14,
                          color: colors.accent,
                          fontWeight: 'bold',
                        }}
                      >
                        {skill.proficiency_level}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Stats */}
            {githubStats && (
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  marginBottom: 32,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: 24,
                  borderRadius: 16,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
                    Repositories
                  </span>
                  <span style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
                    {githubStats.total_repos || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
                    Stars Earned
                  </span>
                  <span style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
                    {githubStats.total_stars || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
                    Contributions
                  </span>
                  <span style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
                    {githubStats.contributions_last_year || 0}
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: 24,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 16 }}>
                  Join me on
                </span>
                <span
                  style={{
                    color: colors.primary,
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginLeft: 8,
                  }}
                >
                  chosn.dev
                </span>
              </div>

              {/* QR Code placeholder */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='10' width='20' height='20' fill='black'/%3E%3Crect x='70' y='10' width='20' height='20' fill='black'/%3E%3Crect x='10' y='70' width='20' height='20' fill='black'/%3E%3Crect x='40' y='40' width='20' height='20' fill='black'/%3E%3C/svg%3E")`,
                    backgroundSize: 'contain',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating developer card:', error);
    return new Response('Error generating card', { status: 500 });
  }
} 