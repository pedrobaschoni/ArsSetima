import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Character } from '../types/character';
import { Location } from '../types/location';
import { TimelineEvent } from '../types/event';

/**
 * Serviço de geração de PDFs
 * Cria documentos PDF formatados para diferentes tipos de entidades
 */
class PDFService {
  /**
   * Estilos CSS para os PDFs
   */
  private readonly styles = `
    <style>
      body {
        font-family: 'Helvetica', 'Arial', sans-serif;
        padding: 40px;
        background-color: #0B0F1A;
        color: #E6E7EA;
      }
      .header {
        background: linear-gradient(135deg, #6B21A8 0%, #9F7AEA 100%);
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        color: #fff;
        font-size: 32px;
      }
      .header p {
        margin: 10px 0 0 0;
        color: #E6E7EA;
        font-size: 14px;
      }
      .section {
        background-color: #1a1f2e;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        border-left: 4px solid #6B21A8;
      }
      .section h2 {
        margin-top: 0;
        color: #9F7AEA;
        font-size: 20px;
      }
      .field {
        margin-bottom: 15px;
      }
      .field-label {
        font-weight: bold;
        color: #F59E0B;
        margin-bottom: 5px;
      }
      .field-value {
        color: #E6E7EA;
        line-height: 1.6;
      }
      .tag {
        display: inline-block;
        background-color: #6B21A8;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        margin-right: 5px;
        font-size: 12px;
      }
      .footer {
        margin-top: 40px;
        text-align: center;
        color: #9F7AEA;
        font-size: 12px;
        border-top: 1px solid #6B21A8;
        padding-top: 20px;
      }
    </style>
  `;

  /**
   * Gera PDF de um personagem
   */
  async generateCharacterPDF(character: Character): Promise<string> {
    const html = `
      <html>
        <head>
          ${this.styles}
        </head>
        <body>
          <div class="header">
            <h1>${character.name}</h1>
            <p>Ficha de Personagem - ArsSétima</p>
          </div>

          ${character.age ? `
          <div class="section">
            <h2>Informações Básicas</h2>
            <div class="field">
              <div class="field-label">Idade</div>
              <div class="field-value">${character.age} anos</div>
            </div>
          </div>
          ` : ''}

          ${character.appearance ? `
          <div class="section">
            <h2>Aparência</h2>
            <div class="field-value">${character.appearance}</div>
          </div>
          ` : ''}

          ${character.powers && character.powers.length > 0 ? `
          <div class="section">
            <h2>Poderes e Habilidades</h2>
            <div class="field-value">
              ${character.powers.map(p => `<span class="tag">${p}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          ${character.goals ? `
          <div class="section">
            <h2>Objetivos</h2>
            <div class="field-value">${character.goals}</div>
          </div>
          ` : ''}

          ${character.secrets ? `
          <div class="section">
            <h2>Segredos</h2>
            <div class="field-value">${character.secrets}</div>
          </div>
          ` : ''}

          ${character.notes ? `
          <div class="section">
            <h2>Notas</h2>
            <div class="field-value">${character.notes}</div>
          </div>
          ` : ''}

          <div class="footer">
            Gerado em ${new Date().toLocaleDateString('pt-BR')} - O Preço do Sétimo Poder
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${character.name}_ficha.pdf`);
  }

  /**
   * Gera PDF de um local
   */
  async generateLocationPDF(location: Location): Promise<string> {
    const html = `
      <html>
        <head>
          ${this.styles}
        </head>
        <body>
          <div class="header">
            <h1>${location.name}</h1>
            <p>Local - ArsSétima</p>
          </div>

          <div class="section">
            <h2>Descrição</h2>
            <div class="field-value">${location.description}</div>
          </div>

          ${location.tags && location.tags.length > 0 ? `
          <div class="section">
            <h2>Tags</h2>
            <div class="field-value">
              ${location.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          <div class="footer">
            Gerado em ${new Date().toLocaleDateString('pt-BR')} - O Preço do Sétimo Poder
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${location.name}_local.pdf`);
  }

  /**
   * Gera PDF de um evento da timeline
   */
  async generateEventPDF(event: TimelineEvent): Promise<string> {
    const html = `
      <html>
        <head>
          ${this.styles}
        </head>
        <body>
          <div class="header">
            <h1>${event.title}</h1>
            <p>Evento - ${new Date(event.date).toLocaleDateString('pt-BR')}</p>
          </div>

          <div class="section">
            <h2>Descrição</h2>
            <div class="field-value">${event.description}</div>
          </div>

          ${event.category ? `
          <div class="section">
            <h2>Categoria</h2>
            <div class="field-value">
              <span class="tag">${event.category}</span>
            </div>
          </div>
          ` : ''}

          ${event.importance ? `
          <div class="section">
            <h2>Importância</h2>
            <div class="field-value">
              <span class="tag">${event.importance.toUpperCase()}</span>
            </div>
          </div>
          ` : ''}

          <div class="footer">
            Gerado em ${new Date().toLocaleDateString('pt-BR')} - O Preço do Sétimo Poder
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${event.title}_evento.pdf`);
  }

  /**
   * Cria e compartilha um PDF
   */
  private async createPDF(html: string, fileName: string): Promise<string> {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      
      // Compartilha o PDF
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        });
      }

      return uri;
    } catch (error) {
      console.error('Error creating PDF:', error);
      throw error;
    }
  }

  /**
   * Gera PDF genérico com conteúdo customizado
   */
  async generateCustomPDF(
    title: string,
    content: string,
    fileName: string
  ): Promise<string> {
    const html = `
      <html>
        <head>
          ${this.styles}
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>ArsSétima</p>
          </div>

          <div class="section">
            <div class="field-value">${content}</div>
          </div>

          <div class="footer">
            Gerado em ${new Date().toLocaleDateString('pt-BR')} - O Preço do Sétimo Poder
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, fileName);
  }
}

export const pdfService = new PDFService();
