import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { validateInput } from '@/lib/validation';
import { ApiResponse, User, AuthResponse } from '@/lib/types';

type UserWithPassword = User & { password: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(loginSchema, body);
    if (!validation.success) {
      const errorMessages = Object.values(validation.errors || {}).join(', ');
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Validasi gagal: ${errorMessages}` },
        { status: 400 }
      );
    }

    const { email, password } = validation.data!;

    // Cari user berdasarkan email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await verifyPassword(password, (user as UserWithPassword).password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      nama: user.nama,
    });

    // Return user data dan token
    const { password: _, ...userWithoutPassword } = user as UserWithPassword;

    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        message: 'Login berhasil',
        data: {
          user: userWithoutPassword,
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server saat memproses login. Silakan coba lagi nanti.' },
      { status: 500 }
    );
  }
}
