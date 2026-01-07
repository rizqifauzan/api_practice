import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Logout di sisi server (token akan dihapus di sisi client)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: 'Logout berhasil',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
