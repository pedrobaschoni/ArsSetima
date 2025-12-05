import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Character } from '../types/character';
import { Location } from '../types/location';
import { TimelineEvent } from '../types/event';

class PDFService {
  private readonly typeColors: Record<string, { primary: string; secondary: string; accent: string }> = {
    character: { primary: '#6B21A8', secondary: '#8b5cf6', accent: '#9F7AEA' },
    location: { primary: '#9F7AEA', secondary: '#c4b5fd', accent: '#e9d5ff' },
    spell: { primary: '#dc2626', secondary: '#ef4444', accent: '#fca5a5' },
    item: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
    creature: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
    faction: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d' },
    event: { primary: '#2563eb', secondary: '#3b82f6', accent: '#93c5fd' },
    curiosity: { primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee' },
    note: { primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1' },
  };

  /**
   * Generates dynamic CSS styles based on entity type and custom colors
   */
  private getStyles(entityType: string, customColors?: { primary: string; secondary: string; accent: string }) {
    const colors = customColors || this.typeColors[entityType] || this.typeColors.character;
    
    return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
        padding: 0;
        background: linear-gradient(135deg, #0B0F1A 0%, #1a1f2e 100%);
        color: #E6E7EA;
        line-height: 1.6;
      }
      
      .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 50px;
        background: #0B0F1A;
      }
      
      .header {
        position: relative;
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%);
        padding: 60px 40px 50px;
        margin: -50px -50px 40px -50px;
        text-align: center;
        overflow: hidden;
        box-shadow: 0 10px 40px ${colors.primary}4d;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 50%, ${colors.accent}33 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${colors.primary}33 0%, transparent 50%);
        pointer-events: none;
      }
      
      .header-content {
        position: relative;
        z-index: 1;
      }
      
      .header h1 {
        font-family: 'Playfair Display', 'Georgia', serif;
        font-size: 48px;
        font-weight: 900;
        color: #ffffff;
        margin-bottom: 12px;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
      }
      
      .header .subtitle {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 8px;
      }
      
      .header .meta {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
      }
      
      .divider {
        height: 3px;
        background: linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%);
        margin: 30px 0;
        opacity: 0.5;
      }
      
      .section {
        background: linear-gradient(145deg, #1a1f2e 0%, #252b3d 100%);
        padding: 30px;
        margin-bottom: 25px;
        border-radius: 12px;
        border-left: 5px solid ${colors.primary};
        box-shadow: 
          0 4px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.05);
        position: relative;
        overflow: hidden;
      }
      
      .section::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, ${colors.primary}19 0%, transparent 70%);
        pointer-events: none;
      }
      
      .section h2 {
        font-family: 'Playfair Display', 'Georgia', serif;
        font-size: 26px;
        font-weight: 700;
        color: ${colors.accent};
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid ${colors.primary}4d;
        position: relative;
        z-index: 1;
      }
      
      .section h2::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%);
      }
      
      .field {
        margin-bottom: 20px;
        position: relative;
        z-index: 1;
      }
      
      .field-label {
        font-weight: 600;
        font-size: 13px;
        color: ${colors.primary};
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        display: block;
      }
      
      .field-value {
        color: #E6E7EA;
        font-size: 15px;
        line-height: 1.8;
        font-weight: 400;
      }
      
      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      
      .tag {
        display: inline-block;
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 8px ${colors.primary}4d;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-top: 15px;
      }
      
      .info-box {
        background: ${colors.primary}19;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid ${colors.primary}33;
      }
      
      .info-box .label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${colors.primary};
        font-weight: 600;
        margin-bottom: 5px;
      }
      
      .info-box .value {
        font-size: 18px;
        font-weight: 600;
        color: ${colors.accent};
      }
      
      .footer {
        margin-top: 60px;
        padding-top: 30px;
        text-align: center;
        border-top: 2px solid ${colors.primary}4d;
        position: relative;
      }
      
      .footer-logo {
        font-family: 'Playfair Display', 'Georgia', serif;
        font-size: 20px;
        font-weight: 700;
        color: ${colors.accent};
        margin-bottom: 8px;
      }
      
      .footer-text {
        color: rgba(230, 231, 234, 0.6);
        font-size: 12px;
        font-weight: 400;
      }
      
      .footer-date {
        color: ${colors.primary};
        font-size: 11px;
        font-weight: 500;
        margin-top: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .watermark {
        position: fixed;
        bottom: 30px;
        right: 30px;
        font-size: 10px;
        color: ${colors.primary}4d;
        font-weight: 500;
        letter-spacing: 1px;
      }
    </style>
  `;
  }

  /**
   * Helper para garantir que o valor seja string
   */
  private ensureString(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }

  /**
   * Gera PDF de um personagem
   */
  async generateCharacterPDF(character: Character): Promise<string> {
    const powers = Array.isArray(character.powers) ? character.powers : [];
    const entityType = 'character';
    
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles(entityType)}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Ficha de Personagem</div>
                <h1>${character.name}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${character.age ? `
            <div class="section">
              <h2>Informações Básicas</h2>
              <div class="info-grid">
                <div class="info-box">
                  <div class="label">Idade</div>
                  <div class="value">${character.age} anos</div>
                </div>
                <div class="info-box">
                  <div class="label">Tipo</div>
                  <div class="value">Personagem</div>
                </div>
              </div>
            </div>
            ` : ''}

            ${character.appearance ? `
            <div class="section">
              <h2>Aparência Física</h2>
              <div class="field-value">${this.ensureString(character.appearance).replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}

            ${powers.length > 0 ? `
            <div class="section">
              <h2>Poderes & Habilidades</h2>
              <div class="tags-container">
                ${powers.map(p => `<span class="tag">${p}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            ${character.goals ? `
            <div class="section">
              <h2>Objetivos & Motivações</h2>
              <div class="field-value">${this.ensureString(character.goals).replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}

            ${character.secrets ? `
            <div class="section">
              <h2>Segredos</h2>
              <div class="field-value">${this.ensureString(character.secrets).replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}

            ${character.notes ? `
            <div class="section">
              <h2>Anotações Adicionais</h2>
              <div class="field-value">${this.ensureString(character.notes).replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
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
    const tags = Array.isArray(location.tags) ? location.tags : [];
    const entityType = 'location';
    
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles(entityType)}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Localização</div>
                <h1>${location.name}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            <div class="section">
              <h2>Descrição do Local</h2>
              <div class="field-value">${this.ensureString(location.description).replace(/\n/g, '<br>')}</div>
            </div>

            ${location.coordinates ? `
            <div class="section">
              <h2>Coordenadas</h2>
              <div class="field-value">${location.coordinates}</div>
            </div>
            ` : ''}

            ${tags.length > 0 ? `
            <div class="section">
              <h2>Características</h2>
              <div class="tags-container">
                ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${location.name}_local.pdf`);
  }

  /**
   * Gera PDF para Curiosidades (Azul)
   */
  async generateCuriosityPDF(title: string, data: any): Promise<string> {
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles('curiosity')}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Curiosidade</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${data.content ? `<div class="section"><h2>Detalhes</h2><div class="field-value">${this.ensureString(data.content).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.tags ? `<div class="section"><h2>Tags</h2><div class="tags-container">${Array.isArray(data.tags) ? data.tags.map((t: string) => `<span class="tag">${t}</span>`).join('') : ''}</div></div>` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${title}.pdf`);
  }

  /**
   * Gera PDF de um evento da timeline
   */

  /**
   * Cria e compartilha um PDF
   */
  private async createPDF(html: string, fileName: string): Promise<string> {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      
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
   * Gera PDF para Magias (Vermelho)
   */
  async generateSpellPDF(title: string, data: any): Promise<string> {
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles('spell')}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Magia</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${data.type ? `<div class="section"><div class="field"><span class="field-label">Tipo</span><span class="field-value">${data.type}</span></div></div>` : ''}
            ${data.level ? `<div class="section"><div class="field"><span class="field-label">Nível</span><span class="field-value">${data.level}</span></div></div>` : ''}
            ${data.requirements ? `<div class="section"><h2>Requisitos</h2><div class="field-value">${this.ensureString(data.requirements).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.effects ? `<div class="section"><h2>Efeitos</h2><div class="field-value">${this.ensureString(data.effects).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.description ? `<div class="section"><h2>Descrição</h2><div class="field-value">${this.ensureString(data.description).replace(/\n/g, '<br>')}</div></div>` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${title}.pdf`);
  }

  /**
   * Gera PDF para Itens (Amarelo)
   */
  async generateItemPDF(title: string, data: any): Promise<string> {
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles('item')}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Item</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${data.type ? `<div class="section"><div class="field"><span class="field-label">Tipo</span><span class="field-value">${data.type}</span></div></div>` : ''}
            ${data.rarity ? `<div class="section"><div class="field"><span class="field-label">Raridade</span><span class="field-value">${data.rarity}</span></div></div>` : ''}
            ${data.powers ? `<div class="section"><h2>Poderes & Efeitos</h2><div class="field-value">${this.ensureString(data.powers).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.description ? `<div class="section"><h2>Descrição</h2><div class="field-value">${this.ensureString(data.description).replace(/\n/g, '<br>')}</div></div>` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${title}.pdf`);
  }

  /**
   * Gera PDF para Criaturas (Verde)
   */
  async generateCreaturePDF(title: string, data: any): Promise<string> {
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles('creature')}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Criatura</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${data.species ? `<div class="section"><div class="field"><span class="field-label">Espécie</span><span class="field-value">${data.species}</span></div></div>` : ''}
            ${data.dangerLevel ? `<div class="section"><div class="field"><span class="field-label">Nível de Perigo</span><span class="field-value">${data.dangerLevel}</span></div></div>` : ''}
            ${data.habitat ? `<div class="section"><h2>Habitat</h2><div class="field-value">${this.ensureString(data.habitat).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.abilities ? `<div class="section"><h2>Habilidades</h2><div class="field-value">${this.ensureString(data.abilities).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.description ? `<div class="section"><h2>Descrição</h2><div class="field-value">${this.ensureString(data.description).replace(/\n/g, '<br>')}</div></div>` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${title}.pdf`);
  }

  /**
   * Gera PDF para Facções (Amarelo)
   */
  async generateFactionPDF(title: string, data: any): Promise<string> {
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles('faction')}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Facção</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${data.alignment ? `<div class="section"><div class="field"><span class="field-label">Alinhamento</span><span class="field-value">${data.alignment}</span></div></div>` : ''}
            ${data.goals ? `<div class="section"><h2>Objetivos</h2><div class="field-value">${this.ensureString(data.goals).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.members ? `<div class="section"><h2>Membros Notáveis</h2><div class="field-value">${this.ensureString(data.members).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${data.description ? `<div class="section"><h2>Descrição</h2><div class="field-value">${this.ensureString(data.description).replace(/\n/g, '<br>')}</div></div>` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${title}.pdf`);
  }

  /**
   * Generates PDF for Events with dynamic colors based on importance level
   */
  async generateEventPDF(title: string, data: any): Promise<string> {
    const importanceColors: Record<string, { primary: string; secondary: string; accent: string }> = {
      'high': { primary: '#ef4444', secondary: '#f87171', accent: '#fca5a5' },
      'medium': { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d' },
      'low': { primary: '#6b7280', secondary: '#9ca3af', accent: '#d1d5db' },
    };
    
    const importance = data.importance || 'medium';
    const colors = importanceColors[importance.toLowerCase()] || importanceColors['medium'];

    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles('event', colors)}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Evento da Linha do Tempo</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${data.date ? `<div class="section"><div class="field"><span class="field-label">Data</span><span class="field-value">${data.date}</span></div></div>` : ''}
            ${data.importance ? `<div class="section"><div class="field"><span class="field-label">Importância</span><span class="field-value">${data.importance.charAt(0).toUpperCase() + data.importance.slice(1)}</span></div></div>` : ''}
            ${data.category ? `<div class="section"><div class="field"><span class="field-label">Categoria</span><span class="field-value">${data.category}</span></div></div>` : ''}
            ${data.description ? `<div class="section"><h2>Descrição</h2><div class="field-value">${this.ensureString(data.description).replace(/\n/g, '<br>')}</div></div>` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${title}.pdf`);
  }

  /**
   * Gera PDF para Notas (cor baseada na prioridade)
   */
  async generateNotePDF(title: string, data: any): Promise<string> {
    const priorityColors: Record<string, { primary: string; secondary: string; accent: string }> = {
      'high': { primary: '#ef4444', secondary: '#f87171', accent: '#fca5a5' },
      'medium': { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d' },
      'low': { primary: '#6b7280', secondary: '#9ca3af', accent: '#d1d5db' },
    };
    
    const priority = data.priority || 'medium';
    const colors = priorityColors[priority.toLowerCase()] || priorityColors['medium'];

    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles('note', colors)}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Nota</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            ${data.priority ? `<div class="section"><div class="field"><span class="field-label">Prioridade</span><span class="field-value">${data.priority.charAt(0).toUpperCase() + data.priority.slice(1)}</span></div></div>` : ''}
            ${data.content ? `<div class="section"><h2>Conteúdo</h2><div class="field-value">${this.ensureString(data.content).replace(/\n/g, '<br>')}</div></div>` : ''}

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, `${title}.pdf`);
  }

  /**
   * Gera PDF genérico com conteúdo customizado
   */
  async generateCustomPDF(
    title: string,
    content: string,
    fileName: string,
    entityType: string = 'character'
  ): Promise<string> {
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          ${this.getStyles(entityType)}
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <div class="header-content">
                <div class="subtitle">Documento</div>
                <h1>${title}</h1>
                <div class="meta">ArsSétima · O Preço do Sétimo Poder</div>
              </div>
            </div>

            <div class="section">
              <div class="field-value">${this.ensureString(content).replace(/\n/g, '<br>')}</div>
            </div>

            <div class="footer">
              <div class="footer-logo">ArsSétima</div>
              <div class="footer-text">O Preço do Sétimo Poder</div>
              <div class="footer-date">Gerado em ${new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}</div>
            </div>
            
            <div class="watermark">ARSSETIMA.APP</div>
          </div>
        </body>
      </html>
    `;

    return this.createPDF(html, fileName);
  }
}

export const pdfService = new PDFService();
