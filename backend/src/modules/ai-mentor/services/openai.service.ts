import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    
    if (apiKey && apiKey !== 'sk-your_openai_api_key_here') {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI service initialized');
    } else {
      this.logger.warn('OpenAI API key not configured - using fallback responses');
    }
  }

  async generateSocraticResponse(
    userMessage: string,
    history: any[],
    context?: any,
  ): Promise<string> {
    // If OpenAI is not configured, return fallback response
    if (!this.openai) {
      return this.generateFallbackResponse(userMessage);
    }

    const systemPrompt = `Kamu adalah AI Mentor untuk platform BUBBLE (Bias Understanding Based Blended Learning Environment).
    
    ATURAN PENTING:
    1. JANGAN PERNAH memberikan jawaban langsung kepada siswa.
    2. Gunakan METODE SOCRATIC - ajukan pertanyaan balik untuk membimbing siswa.
    3. Berikan PETUNJUK (hints) yang mengarahkan tanpa memberikan jawaban.
    4. Bantu siswa MENGIDENTIFIKASI bias dalam informasi.
    5. Dorong siswa untuk BERPIKIR KRITIS dan mencari sumber terpercaya.
    6. Gunakan BAHASA INDONESIA yang ramah dan mendukung.
    7. Berikan PUJIAN ketika siswa menunjukkan pemikiran kritis yang baik.
    
    CONTEXT SISWA:
    - Role: Siswa SMA
    - Tujuan: Belajar mengidentifikasi bias informasi dan meningkatkan critical thinking
    ${context ? `- Konteks Simulasi: ${JSON.stringify(context)}` : ''}
    
    FORMAT RESPONS:
    - Mulai dengan apresiasi/validasi
    - Ajukan pertanyaan yang memancing pemikiran
    - Berikan hint jika diperlukan
    - Akhiri dengan dorongan positif`;

    try {
      const messages: any[] = [
        { role: 'system', content: systemPrompt },
      ];

      // Add conversation history
      for (const item of history) {
        messages.push({ role: 'user', content: item.userMessage });
        messages.push({ role: 'assistant', content: item.aiResponse });
      }

      // Add current message
      messages.push({ role: 'user', content: userMessage });

      const completion = await this.openai.chat.completions.create({
        model: this.configService.get('openai.model', 'gpt-4-turbo-preview'),
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      });

      return completion.choices[0]?.message?.content || 'Maaf, saya kesulitan merespons saat ini.';
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      return this.generateFallbackResponse(userMessage);
    }
  }

  async generateHint(post: any): Promise<string> {
    if (!this.openai) {
      return this.generateFallbackHint(post);
    }

    const prompt = `Berikan PETUNJUK (bukan jawaban) untuk membantu siswa mengidentifikasi bias dalam postingan berikut:
    
    Postingan: "${post.content}"
    ${post.biasType ? `Jenis bias yang ada: ${post.biasType}` : ''}
    
    Berikan hint yang membantu siswa berpikir, BUKAN jawaban langsung.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content || 'Perhatikan sumber informasi dan fakta yang disajikan.';
    } catch (error) {
      return this.generateFallbackHint(post);
    }
  }

  async generateExplanation(topic: string): Promise<string> {
    if (!this.openai) {
      return `Berikut penjelasan tentang "${topic}":\n\nIni adalah area yang penting dalam literasi digital. Coba cari informasi lebih lanjut dari sumber terpercaya.`;
    }

    const prompt = `Jelaskan konsep "${topic}" dalam konteks literasi digital dan critical thinking untuk siswa SMA. Gunakan bahasa yang mudah dipahami dan berikan contoh konkret.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 400,
      });

      return completion.choices[0]?.message?.content || `Penjelasan tentang ${topic} tidak tersedia saat ini.`;
    } catch (error) {
      return `Maaf, saya tidak bisa memberikan penjelasan detail tentang ${topic} saat ini.`;
    }
  }

  async generateRecommendations(weakAreas: string[]): Promise<any> {
    if (!this.openai || weakAreas.length === 0) {
      return {
        recommendations: weakAreas.map((area) => ({
          area,
          title: `Pelajari lebih lanjut tentang ${area}`,
          description: `Fokus pada materi yang berkaitan dengan ${area.replace(/_/g, ' ')}`,
          type: 'SIMULATION',
          priority: 'HIGH',
        })),
      };
    }

    const prompt = `Buat rekomendasi materi pembelajaran untuk siswa yang kesulitan dalam area berikut:
    ${weakAreas.join(', ')}
    
    Berikan dalam format JSON:
    {
      "recommendations": [
        {
          "area": "nama area",
          "title": "judul rekomendasi",
          "description": "deskripsi singkat",
          "type": "SIMULATION | QUIZ | ARTICLE",
          "priority": "HIGH | MEDIUM | LOW"
        }
      ]
    }`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
      return { recommendations: [] };
    }
  }

  private generateFallbackResponse(userMessage: string): string {
    if (userMessage.toLowerCase().includes('jawaban')) {
      return 'Saya tidak bisa memberikan jawaban langsung. Coba ceritakan apa yang sudah kamu pahami tentang topik ini, dan saya akan membantu mengarahkanmu.';
    }
    if (userMessage.toLowerCase().includes('bias')) {
      return 'Bagus! Kamu sudah menyadari adanya bias. Bisakah kamu mengidentifikasi jenis bias apa yang mungkin ada di sini? Coba periksa apakah ada kata-kata yang bermuatan emosional atau informasi yang tidak berimbang.';
    }
    if (userMessage.toLowerCase().includes('benar') || userMessage.toLowerCase().includes('salah')) {
      return 'Pertanyaan yang bagus! Daripada saya memberi tahu benar atau salah, coba kamu analisis dulu: apa sumber informasinya? Apakah ada bukti yang mendukung? Apakah ada kemungkinan bias?';
    }
    return 'Pertanyaan yang menarik! Coba pikirkan: apa sumber informasi ini dan apakah ada kepentingan tertentu di baliknya? Saya di sini untuk membantumu berpikir, bukan memberi jawaban.';
  }

  private generateFallbackHint(post: any): string {
    const hints = [
      'Perhatikan sumber informasi. Apakah sumbernya terpercaya?',
      'Cek apakah ada kata-kata yang bermuatan emosional atau provokatif.',
      'Apakah informasi ini menampilkan kedua sisi secara berimbang?',
      'Coba bandingkan dengan informasi dari sumber lain yang terpercaya.',
      'Perhatikan apakah ada data atau statistik yang mendukung klaim ini.',
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    if (post.biasType) {
      return `[Bias terdeteksi: ${post.biasType}] ${randomHint}`;
    }
    
    return randomHint;
  }
}