import { GET } from '@/app/api/health/route'
import { NextRequest } from 'next/server'

// Mock Supabase server client
jest.mock('@/lib/supabase/server', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        limit: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { count: 1 },
            error: null
          }))
        }))
      }))
    }))
  }))
}))

describe('/api/health', () => {
  beforeEach(() => {
    // Set required environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return healthy status when everything is working', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
      services: {
        database: 'connected',
        environment: 'configured'
      },
      version: expect.any(String)
    })
  })

  it('should return unhealthy status when database connection fails', async () => {
    // Mock database error
    const mockError = new Error('Database connection failed')
    
    jest.doMock('@/lib/supabase/server', () => ({
      createServerClient: jest.fn(() => ({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            limit: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: null,
                error: mockError
              }))
            }))
          }))
        }))
      }))
    }))

    // Re-import the function after mocking
    const { GET: unhealthyGET } = await import('@/app/api/health/route')
    
    const response = await unhealthyGET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.status).toBe('unhealthy')
    expect(data.error).toContain('Database error')
  })

  it('should return unhealthy status when environment variables are missing', async () => {
    // Remove required environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.status).toBe('unhealthy')
    expect(data.error).toContain('Missing environment variables')
  })
}) 