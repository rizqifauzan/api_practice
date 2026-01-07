import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSiswaSchema } from '@/lib/validation';
import { validateInput } from '@/lib/validation';
import { ApiResponse, Siswa, PaginatedResponse, PaginationParams } from '@/lib/types';

// GET - Get all students with pagination, search, filter, and sorting
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const kelas = searchParams.get('kelas') || '';
    const jurusan = searchParams.get('jurusan') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabaseAdmin
      .from('siswa')
      .select('*', { count: 'exact' });

    // Apply search filter (nama, nis, email)
    if (search) {
      query = query.or(`nama.ilike.%${search}%,nis.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply kelas filter
    if (kelas) {
      query = query.eq('kelas', kelas);
    }

    // Apply jurusan filter
    if (jurusan) {
      query = query.eq('jurusan', jurusan);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: siswaData, error, count } = await query;

    if (error) {
      console.error('Get siswa error:', error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Gagal mengambil data siswa' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<ApiResponse<PaginatedResponse<Siswa>>>(
      {
        success: true,
        data: {
          data: siswaData || [],
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get siswa error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST - Create new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(createSiswaSchema, body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Validasi gagal' },
        { status: 400 }
      );
    }

    const { email, telepon, alamat, ...rest } = validation.data!;

    // Get user email from headers (set by middleware)
    const createdBy = request.headers.get('x-user-email') || 'unknown';

    // Cek apakah NIS sudah terdaftar
    const { data: existingSiswa } = await supabaseAdmin
      .from('siswa')
      .select('id')
      .eq('nis', validation.data!.nis)
      .single();

    if (existingSiswa) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'NIS sudah terdaftar' },
        { status: 409 }
      );
    }

    // Buat siswa baru
    const { data: newSiswa, error } = await supabaseAdmin
      .from('siswa')
      .insert({
        ...rest,
        email: email || null,
        telepon: telepon || null,
        alamat: alamat || null,
        created_by: createdBy,
      })
      .select()
      .single();

    if (error) {
      console.error('Create siswa error:', error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Gagal menambahkan siswa' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Siswa>>(
      {
        success: true,
        message: 'Siswa berhasil ditambahkan',
        data: newSiswa as Siswa,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create siswa error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
