import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FactCheckService {
  constructor(private readonly prisma: PrismaService) {}

  async getBiasTypes() {
    return [
      { id: 'CONFIRMATION_BIAS', name: 'Confirmation Bias', description: 'Kecenderungan mencari informasi yang mendukung keyakinan yang sudah ada.' },
      { id: 'ANCHORING_BIAS', name: 'Anchoring Bias', description: 'Kecenderungan terlalu bergantung pada informasi pertama.' },
      { id: 'AVAILABILITY_BIAS', name: 'Availability Bias', description: 'Menilai berdasarkan informasi yang paling mudah diingat.' },
      { id: 'HALO_EFFECT', name: 'Halo Effect', description: 'Menilai keseluruhan berdasarkan satu kesan.' },
      { id: 'BANDWAGON_EFFECT', name: 'Bandwagon Effect', description: 'Mengikuti apa yang dilakukan orang banyak.' },
      { id: 'AUTHORITY_BIAS', name: 'Authority Bias', description: 'Terlalu percaya pada figur otoritas.' },
      { id: 'FRAMING_EFFECT', name: 'Framing Effect', description: 'Dipengaruhi cara informasi disajikan.' },
      { id: 'SURVIVORSHIP_BIAS', name: 'Survivorship Bias', description: 'Fokus pada yang berhasil, abaikan yang gagal.' },
      { id: 'SELECTION_BIAS', name: 'Selection Bias', description: 'Kesimpulan dari data tidak representatif.' },
      { id: 'FALSE_CONSENSUS', name: 'False Consensus', description: 'Menganggap orang lain setuju dengan kita.' },
      { id: 'HINDSIGHT_BIAS', name: 'Hindsight Bias', description: 'Merasa sudah bisa memprediksi setelah kejadian.' },
      { id: 'OUTCOME_BIAS', name: 'Outcome Bias', description: 'Menilai keputusan berdasarkan hasilnya.' },
    ];
  }

  async getFactCheckTips() {
    return {
      tips: [
        'Periksa sumber informasi - apakah dari sumber terpercaya?',
        'Cek tanggal publikasi - apakah informasinya masih relevan?',
        'Bandingkan dengan sumber lain - apakah ada konsistensi?',
        'Perhatikan bahasa yang digunakan - apakah provokatif atau netral?',
        'Cek fakta dan data - apakah ada bukti yang mendukung?',
        'Identifikasi bias - apakah ada kepentingan tertentu?',
        'Periksa gambar/video - apakah sudah dimanipulasi?',
        'Baca seluruh konten, bukan hanya judulnya.',
      ],
      methodology: 'Metode CRAAP: Currency, Relevance, Authority, Accuracy, Purpose',
    };
  }

  async analyzeContent(content: string) {
    // Simple analysis - in production, use NLP/AI
    const indicators = {
      emotionalLanguage: this.detectEmotionalLanguage(content),
      clickbaitPhrases: this.detectClickbaitPhrases(content),
      unsupportedClaims: this.detectUnsupportedClaims(content),
    };

    return {
      content,
      analysis: indicators,
      recommendation: this.getRecommendation(indicators),
    };
  }

  private detectEmotionalLanguage(content: string): string[] {
    const emotionalWords = [
      'mengerikan', 'menghebohkan', 'mengejutkan', 'gila', 'parah',
      'luar biasa', 'fantastis', 'dahsyat', 'mengerikan', 'mematikan',
    ];
    return emotionalWords.filter((word) => content.toLowerCase().includes(word));
  }

  private detectClickbaitPhrases(content: string): string[] {
    const clickbaitPhrases = [
      'kamu tidak akan percaya', 'ini dia rahasianya', 'nomor 7 mengejutkan',
      'yang terjadi selanjutnya', 'baca sebelum dihapus', 'viral',
      'tersebar luas', 'breaking news',
    ];
    return clickbaitPhrases.filter((phrase) => content.toLowerCase().includes(phrase));
  }

  private detectUnsupportedClaims(content: string): string[] {
    const claimPatterns = [
      'penelitian menunjukkan', 'para ahli mengatakan', 'studi membuktikan',
      'banyak orang percaya', 'menurut sumber', 'terbukti secara ilmiah',
    ];
    return claimPatterns.filter((pattern) => content.toLowerCase().includes(pattern));
  }

  private getRecommendation(indicators: any): string {
    const flags = [
      ...indicators.emotionalLanguage,
      ...indicators.clickbaitPhrases,
      ...indicators.unsupportedClaims,
    ];

    if (flags.length >= 5) {
      return 'HIGH_RISK: Konten ini memiliki banyak indikator misinformasi. Sangat disarankan untuk melakukan fact-check menyeluruh.';
    } else if (flags.length >= 3) {
      return 'MEDIUM_RISK: Konten ini memiliki beberapa indikator yang perlu diwaspadai. Lakukan verifikasi lebih lanjut.';
    } else if (flags.length >= 1) {
      return 'LOW_RISK: Ada beberapa indikator, tetapi masih dalam batas wajar. Tetap waspada.';
    }
    return 'CLEAN: Tidak ditemukan indikator signifikan. Namun tetap lakukan verifikasi.';
  }
}