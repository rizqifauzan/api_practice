import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiResponse, User } from '@/lib/types';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Fallback: Get user ID from headers (set by middleware) or verify token directly
    let userId = request.headers.get('x-user-id');
    
    // If x-user-id is not available, verify token directly (fallback for production)
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);
      
      if (!token) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Anda tidak memiliki akses. Silakan login kembali.' },
          { status: 401 }
        );
      }
      
      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Token tidak valid. Silakan login kembali.' },
          { status: 401 }
        );
      }
      
      userId = payload.userId;
    }

    // Get user data
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, nama, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<User>>(
      {
        success: true,
        data: user as User,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server saat mengambil data user. Silakan coba lagi nanti.' },
      { status: 500 }
    );
  }
}
