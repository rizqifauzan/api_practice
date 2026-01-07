import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { validateInput } from '@/lib/validation';
import { ApiResponse, User } from '@/lib/types';

// Type for user from database (includes password)
type UserWithPassword = User & { password: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Validasi gagal' },
        { status: 400 }
      );
    }

    const { nama, email, password } = validation.data!;

    // Cek apakah email sudah terdaftar
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        nama,
        email,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Gagal membuat user' },
        { status: 500 }
      );
    }

    // Return user data tanpa password
    const { password: _, ...userWithoutPassword } = newUser as UserWithPassword;

    return NextResponse.json<ApiResponse<User>>(
      {
        success: true,
        message: 'Registrasi berhasil',
        data: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
