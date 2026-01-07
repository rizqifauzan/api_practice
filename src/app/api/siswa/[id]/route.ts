import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { updateSiswaSchema } from '@/lib/validation';
import { validateInput } from '@/lib/validation';
import { ApiResponse, Siswa } from '@/lib/types';

// GET - Get student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: siswa, error } = await supabaseAdmin
      .from('siswa')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !siswa) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Siswa>>(
      {
        success: true,
        data: siswa as Siswa,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get siswa error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server saat mengambil data siswa. Silakan coba lagi nanti.' },
      { status: 500 }
    );
  }
}

// PUT - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validation = validateInput(updateSiswaSchema, body);
    if (!validation.success) {
      const errorMessages = Object.values(validation.errors || {}).join(', ');
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Validasi gagal: ${errorMessages}` },
        { status: 400 }
      );
    }

    // Cek apakah siswa ada
    const { data: existingSiswa } = await supabaseAdmin
      .from('siswa')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingSiswa) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah NIS sudah terdaftar (jika diupdate)
    if (validation.data!.nis) {
      const { data: duplicateSiswa } = await supabaseAdmin
        .from('siswa')
        .select('id')
        .eq('nis', validation.data!.nis)
        .neq('id', id)
        .single();

      if (duplicateSiswa) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'NIS sudah terdaftar' },
          { status: 409 }
        );
      }
    }

    // Update siswa
    const { email, telepon, alamat, ...rest } = validation.data!;

    const { data: updatedSiswa, error } = await supabaseAdmin
      .from('siswa')
      .update({
        ...rest,
        email: email || null,
        telepon: telepon || null,
        alamat: alamat || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update siswa error:', error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Gagal mengupdate data siswa di database. Silakan coba lagi nanti.' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Siswa>>(
      {
        success: true,
        message: 'Siswa berhasil diupdate',
        data: updatedSiswa as Siswa,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update siswa error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server saat mengupdate data siswa. Silakan coba lagi nanti.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Cek apakah siswa ada
    const { data: existingSiswa } = await supabaseAdmin
      .from('siswa')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingSiswa) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus siswa
    const { error } = await supabaseAdmin
      .from('siswa')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete siswa error:', error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Gagal menghapus data siswa dari database. Silakan coba lagi nanti.' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: 'Siswa berhasil dihapus',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete siswa error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server saat menghapus data siswa. Silakan coba lagi nanti.' },
      { status: 500 }
    );
  }
}
