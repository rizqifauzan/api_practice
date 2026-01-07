import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiResponse, User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers (set by middleware)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Anda tidak memiliki akses. Silakan login kembali.' },
        { status: 401 }
      );
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
