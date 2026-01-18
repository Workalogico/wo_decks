/* ═══════════════════════════════════════════════════════════════
   WORKALÓGICO CHATBOT COMPONENT
   Widget de chat con selector de modelos AI
   Integración con OpenAI, Anthropic y Google Gemini
   ═══════════════════════════════════════════════════════════════ */

// Configuración de modelos
const AI_MODELS = {
  'gpt-4': {
    name: 'GPT-4',
    provider: 'openai',
    description: 'OpenAI más potente',
    icon: '🟢',
    iconClass: 'gpt',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo-preview'
  },
  'claude': {
    name: 'Claude 3.5',
    provider: 'anthropic',
    description: 'Anthropic, contexto largo',
    icon: '🟠',
    iconClass: 'claude',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022'
  },
  'gemini': {
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Google, multimodal',
    icon: '🔵',
    iconClass: 'gemini',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro'
  }
};

// Base de conocimiento de Workalógico
const WORKALOGICO_KNOWLEDGE = `
# Workalógico - Estudio de Crecimiento

## Identidad
- Somos un Growth Studio, no agencia ni consultora
- Diseñamos, desarrollamos y escalamos productos, marcas y negocios
- Sistema operativo: WoOS (The Workalógico Operating System for Growth)

## Servicios Principales

### 1. GEOINTELIGENCIA
- Análisis geoestadístico para decisiones de ubicación
- Scoring de ubicaciones 0-100
- Fuentes: INEGI, DENUE, HERE API, Google Maps, Satelital
- Metodología: ADN Comercial, Isócronas, Precision Audience, Matriz Oportunidad
- Precios: Estándar $40-60K (1 ubicación), Pro $80-120K (3-5 ubicaciones), Enterprise $150-250K (10+)
- Tiempo: 2-6 semanas
- 500M+ data points procesados

### 2. MARKETING DIGITAL (PyMEs)
- Meta Ads + Google Ads optimizados
- Landing Pages de conversión
- Email Marketing automatizado
- SEO Local
- Precios: Arranque $15K/mes, Crecimiento $25K/mes, Aceleración $40K/mes
- ROAS promedio: 3-5x
- Resultados en 90 días

### 3. CRM ENTERPRISE
- Implementación HubSpot, Pipedrive, Salesforce, Zoho
- Metodología DDBE: Discovery, Design, Build, Enable
- 85% tasa de adopción (vs 40% industria)
- Integraciones: WhatsApp, Email, ERP, Facturación
- Precios: Starter $80-120K, Business $150-250K, Enterprise $300-500K
- Tiempo: 4-12 semanas

### 4. AUTOMATIZACIÓN
- Make, Zapier, n8n, Power Automate
- Áreas: Ventas/CRM, Finanzas, Operaciones, RRHH
- ROI: 40+ horas/semana ahorradas, 95% reducción errores
- Precios: Quick Win $40-80K, Departamento $120-200K, Enterprise $250-400K
- Incluye 3 meses de monitoreo

### 5. AI EXPERTS
- Agentes de IA (Ventas, Soporte, Análisis, Contenido)
- AI Implementation (Copilot, RAG, Computer Vision, Transcripción)
- Formación (Workshop Ejecutivo, Bootcamp Prompting, Certificación)
- Stack: OpenAI, Anthropic, Google, LangChain, CrewAI
- Precios: Agentes $80-250K, Implementation $60-180K, Formación $25-150K
- 50+ agentes implementados, 200+ profesionales capacitados

## Contacto
- Email: contacto@workalogico.mx
- Web: www.workalogico.mx
- Ubicación: México

## Valores
- Claridad funcional
- Precisión
- Simplicidad estructurada
- Resultados medibles
`;

// System prompt para el chatbot
const SYSTEM_PROMPT = `Eres el asistente virtual de Workalógico, un Growth Studio mexicano. 

Tu función es:
1. Responder preguntas sobre los servicios de Workalógico
2. Ayudar a calificar leads identificando sus necesidades
3. Agendar llamadas de descubrimiento cuando sea apropiado
4. Mantener un tono profesional pero accesible (System Mode Wo: 80% técnico, 20% emocional)

Reglas:
- Respuestas concisas (máximo 3-4 oraciones)
- Usa datos específicos (precios, tiempos, porcentajes)
- No inventes información fuera del conocimiento base
- Si no sabes algo, ofrece conectar con un humano
- Sugiere el servicio más adecuado según la necesidad

${WORKALOGICO_KNOWLEDGE}`;

// Clase principal del chatbot
class WoChatbot {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.messages = [];
    this.currentModel = options.defaultModel || 'gpt-4';
    this.isTyping = false;
    this.apiKeys = options.apiKeys || {};
    this.options = {
      showModelSelector: options.showModelSelector !== false,
      showSuggestions: options.showSuggestions !== false,
      welcomeMessage: options.welcomeMessage || '¡Hola! Soy el asistente de Workalógico. ¿En qué puedo ayudarte hoy?',
      placeholder: options.placeholder || 'Escribe tu mensaje...',
      ...options
    };

    this.init();
  }

  init() {
    this.createStructure();
    this.bindEvents();
    
    // Mostrar mensaje de bienvenida
    if (this.options.welcomeMessage) {
      this.addMessage('assistant', this.options.welcomeMessage);
    }
  }

  createStructure() {
    const model = AI_MODELS[this.currentModel];
    
    this.container.innerHTML = `
      <div class="wo-chat-container animate-in">
        <!-- Header -->
        <div class="wo-chat-header">
          <div class="wo-chat-header__left">
            <div class="wo-chat-header__avatar">🤖</div>
            <div class="wo-chat-header__info">
              <h3>Asistente Workalógico</h3>
              <div class="wo-chat-header__status">En línea</div>
            </div>
          </div>
          
          ${this.options.showModelSelector ? `
          <div class="wo-chat-model-selector">
            <button class="wo-chat-model-btn">
              <span class="wo-chat-model-btn__icon ${model.iconClass}">${model.icon}</span>
              <span class="wo-chat-model-btn__name">${model.name}</span>
              <span class="wo-chat-model-btn__arrow">▼</span>
            </button>
            <div class="wo-chat-model-dropdown">
              ${Object.entries(AI_MODELS).map(([id, m]) => `
                <div class="wo-chat-model-option ${id === this.currentModel ? 'active' : ''}" data-model="${id}">
                  <div class="wo-chat-model-option__icon ${m.iconClass}">${m.icon}</div>
                  <div class="wo-chat-model-option__info">
                    <h4>${m.name}</h4>
                    <p>${m.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
        
        <!-- Messages -->
        <div class="wo-chat-messages" id="wo-chat-messages"></div>
        
        <!-- Suggestions -->
        ${this.options.showSuggestions ? `
        <div class="wo-chat-suggestions">
          <button class="wo-chat-suggestion" data-text="¿Qué servicios ofrecen?">¿Qué servicios ofrecen?</button>
          <button class="wo-chat-suggestion" data-text="¿Cuánto cuesta el análisis geoestadístico?">Precios geointeligencia</button>
          <button class="wo-chat-suggestion" data-text="¿Cómo funcionan los agentes de IA?">Agentes de IA</button>
        </div>
        ` : ''}
        
        <!-- Input -->
        <div class="wo-chat-input-area">
          <input 
            type="text" 
            class="wo-chat-input" 
            id="wo-chat-input"
            placeholder="${this.options.placeholder}"
            autocomplete="off"
          >
          <button class="wo-chat-send-btn" id="wo-chat-send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.messagesContainer = this.container.querySelector('#wo-chat-messages');
    this.input = this.container.querySelector('#wo-chat-input');
    this.sendBtn = this.container.querySelector('#wo-chat-send');
  }

  bindEvents() {
    // Send message
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Model selector
    if (this.options.showModelSelector) {
      const selector = this.container.querySelector('.wo-chat-model-selector');
      const btn = this.container.querySelector('.wo-chat-model-btn');
      const options = this.container.querySelectorAll('.wo-chat-model-option');

      btn.addEventListener('click', () => {
        selector.classList.toggle('open');
      });

      options.forEach(opt => {
        opt.addEventListener('click', () => {
          this.changeModel(opt.dataset.model);
          selector.classList.remove('open');
        });
      });

      // Close dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!selector.contains(e.target)) {
          selector.classList.remove('open');
        }
      });
    }

    // Suggestions
    if (this.options.showSuggestions) {
      const suggestions = this.container.querySelectorAll('.wo-chat-suggestion');
      suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
          this.input.value = btn.dataset.text;
          this.sendMessage();
        });
      });
    }
  }

  changeModel(modelId) {
    if (!AI_MODELS[modelId]) return;
    
    this.currentModel = modelId;
    const model = AI_MODELS[modelId];
    
    // Update UI
    const btn = this.container.querySelector('.wo-chat-model-btn');
    btn.querySelector('.wo-chat-model-btn__icon').className = `wo-chat-model-btn__icon ${model.iconClass}`;
    btn.querySelector('.wo-chat-model-btn__icon').textContent = model.icon;
    btn.querySelector('.wo-chat-model-btn__name').textContent = model.name;
    
    // Update active state
    const options = this.container.querySelectorAll('.wo-chat-model-option');
    options.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.model === modelId);
    });

    // Notify user
    this.addSystemMessage(`Modelo cambiado a ${model.name}`);
  }

  async sendMessage() {
    const text = this.input.value.trim();
    if (!text || this.isTyping) return;

    // Clear input
    this.input.value = '';

    // Add user message
    this.addMessage('user', text);

    // Show typing indicator
    this.showTyping();

    try {
      // Get AI response
      const response = await this.getAIResponse(text);
      this.hideTyping();
      this.addMessage('assistant', response);
    } catch (error) {
      this.hideTyping();
      this.addMessage('assistant', 'Disculpa, hubo un problema al procesar tu mensaje. ¿Podrías intentar de nuevo?');
      console.error('Chat error:', error);
    }
  }

  async getAIResponse(userMessage) {
    const model = AI_MODELS[this.currentModel];
    
    // Check if API key is available
    const apiKey = this.apiKeys[model.provider];
    
    if (apiKey) {
      // Use real API
      return await this.callRealAPI(model, userMessage, apiKey);
    } else {
      // Use intelligent fallback
      return this.getSmartFallbackResponse(userMessage);
    }
  }

  async callRealAPI(model, userMessage, apiKey) {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...this.messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: userMessage }
    ];

    try {
      if (model.provider === 'openai') {
        const response = await fetch(model.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model.model,
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
          })
        });
        
        const data = await response.json();
        return data.choices[0].message.content;
      }
      
      if (model.provider === 'anthropic') {
        const response = await fetch(model.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model.model,
            max_tokens: 500,
            system: SYSTEM_PROMPT,
            messages: messages.filter(m => m.role !== 'system')
          })
        });
        
        const data = await response.json();
        return data.content[0].text;
      }
      
      if (model.provider === 'google') {
        const url = `${model.apiEndpoint}?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${SYSTEM_PROMPT}\n\nUsuario: ${userMessage}`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7
            }
          })
        });
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error(`API error (${model.provider}):`, error);
      return this.getSmartFallbackResponse(userMessage);
    }
  }

  getSmartFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Patrones de respuesta inteligente basados en keywords
    const responses = {
      // Servicios generales
      servicios: 'Ofrecemos 5 verticales de servicio: **Geointeligencia** (análisis de ubicaciones), **Marketing Digital** (para PyMEs), **CRM Enterprise** (HubSpot, Salesforce), **Automatización** (Make, Zapier), y **AI Experts** (agentes e implementación de IA). ¿Cuál te interesa conocer más?',
      
      // Geointeligencia
      geo: 'Nuestro servicio de **Geointeligencia** analiza ubicaciones con 500M+ data points. Incluye scoring 0-100, análisis de competencia, isócronas y matriz de oportunidad. Precios desde **$40K MXN** por ubicación. ¿Tienes una ubicación en mente que analizar?',
      ubicacion: 'El análisis geoestadístico evalúa población, ingreso, competencia y tráfico de cualquier ubicación. El scoring 0-100 te dice qué tan viable es. Entrega en 2-6 semanas. ¿Quieres agendar una llamada para discutir tu proyecto?',
      
      // Marketing
      marketing: 'Nuestro servicio de **Marketing Digital** está diseñado para PyMEs. Incluye Meta Ads, Google Ads, Landing Pages y Email Marketing. Paquetes desde **$15K/mes** con ROAS promedio de 3-5x. Resultados medibles en 90 días.',
      ads: 'Manejamos campañas en Meta (Facebook/Instagram) y Google Ads optimizadas para conversión, no solo clics. Incluimos landing pages de alto rendimiento y tracking completo. El paquete Crecimiento a $25K/mes es el más popular.',
      
      // CRM
      crm: 'Implementamos **CRM** (HubSpot, Pipedrive, Salesforce, Zoho) con 85% de adopción real vs 40% de la industria. Nuestra metodología DDBE incluye discovery, diseño, implementación y capacitación. Desde **$80K MXN**.',
      hubspot: 'Somos partners certificados de HubSpot. Implementamos Marketing Hub, Sales Hub y Service Hub con integraciones a WhatsApp, facturación y ERP. El paquete Business ($150-250K) es ideal para equipos de 11-50 usuarios.',
      
      // Automatización
      automatizacion: 'Con **Automatización** ahorramos 40+ horas semanales automatizando procesos repetitivos. Usamos Make, Zapier, n8n y Power Automate. ROI positivo en 3-6 meses. Desde **$40K MXN** por proyecto.',
      zapier: 'Trabajamos con Make, Zapier, n8n y Power Automate según tu stack. Automatizamos ventas, finanzas, operaciones y RRHH. El paquete Departamento ($120-200K) incluye 5-10 automatizaciones.',
      
      // AI
      ia: 'Nuestro servicio **AI Experts** incluye desarrollo de agentes de IA, implementación de herramientas (Copilot, RAG) y formación. Hemos implementado 50+ agentes y capacitado 200+ profesionales. Desde **$25K MXN** en formación.',
      agente: 'Desarrollamos agentes de IA para ventas, soporte, análisis y contenido. Funcionan 24/7 en WhatsApp/Web. Un agente de ventas básico cuesta desde **$80K MXN** con deploy incluido.',
      chatgpt: 'Implementamos ChatGPT/Claude sobre tus documentos (RAG corporativo), Copilot empresarial, y agentes personalizados. No somos vendor-locked: elegimos el modelo según tu caso de uso.',
      
      // Precios
      precio: '¿Sobre qué servicio quieres conocer precios? Tenemos: Geointeligencia (desde $40K), Marketing ($15K/mes), CRM (desde $80K), Automatización (desde $40K), AI Experts (desde $25K).',
      costo: '¿Sobre qué servicio quieres conocer precios? Tenemos: Geointeligencia (desde $40K), Marketing ($15K/mes), CRM (desde $80K), Automatización (desde $40K), AI Experts (desde $25K).',
      
      // Contacto
      contacto: 'Puedes contactarnos en **contacto@workalogico.mx** o visitar **www.workalogico.mx**. ¿Te gustaría que agendemos una llamada de descubrimiento gratuita?',
      llamada: '¡Perfecto! Puedes agendar una llamada de descubrimiento gratuita escribiendo a **contacto@workalogico.mx**. Evaluamos tu caso y te damos una propuesta en 48 horas.',
      
      // Saludo
      hola: '¡Hola! Soy el asistente de Workalógico. Puedo ayudarte con información sobre nuestros servicios de Geointeligencia, Marketing, CRM, Automatización e IA. ¿Qué te gustaría saber?',
      
      // Default
      default: 'Gracias por tu pregunta. Para darte información precisa, ¿podrías decirme si te interesa: análisis de ubicaciones (Geointeligencia), marketing digital, implementación de CRM, automatización de procesos, o implementación de IA?'
    };

    // Match keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (keyword !== 'default' && msg.includes(keyword)) {
        return response;
      }
    }

    // Check for specific patterns
    if (msg.includes('cuanto') || msg.includes('cuánto') || msg.includes('precio') || msg.includes('cuesta')) {
      if (msg.includes('geo') || msg.includes('ubicacion') || msg.includes('ubicación')) {
        return responses.geo;
      }
      if (msg.includes('marketing') || msg.includes('ads')) {
        return responses.marketing;
      }
      if (msg.includes('crm')) {
        return responses.crm;
      }
      if (msg.includes('automatiz')) {
        return responses.automatizacion;
      }
      if (msg.includes('ia') || msg.includes('ai') || msg.includes('agente')) {
        return responses.ia;
      }
      return responses.precio;
    }

    return responses.default;
  }

  addMessage(role, content) {
    this.messages.push({ role, content, timestamp: new Date() });
    
    const messageEl = document.createElement('div');
    messageEl.className = `wo-chat-message ${role}`;
    messageEl.innerHTML = `
      <div class="wo-chat-message__avatar">${role === 'user' ? '👤' : '🤖'}</div>
      <div class="wo-chat-message__content">${this.formatMessage(content)}</div>
    `;
    
    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
  }

  addSystemMessage(content) {
    const messageEl = document.createElement('div');
    messageEl.className = 'wo-chat-message system';
    messageEl.innerHTML = `
      <div class="wo-chat-message__content" style="background: rgba(255, 203, 0, 0.1); border: 1px solid rgba(255, 203, 0, 0.3); font-size: 0.75rem; color: #94A3B8;">
        ${content}
      </div>
    `;
    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
  }

  formatMessage(text) {
    // Basic markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  showTyping() {
    this.isTyping = true;
    this.sendBtn.disabled = true;
    
    const typingEl = document.createElement('div');
    typingEl.className = 'wo-chat-message assistant';
    typingEl.id = 'wo-chat-typing';
    typingEl.innerHTML = `
      <div class="wo-chat-message__avatar">🤖</div>
      <div class="wo-chat-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    this.messagesContainer.appendChild(typingEl);
    this.scrollToBottom();
  }

  hideTyping() {
    this.isTyping = false;
    this.sendBtn.disabled = false;
    
    const typingEl = document.getElementById('wo-chat-typing');
    if (typingEl) typingEl.remove();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  // Configurar API keys dinámicamente
  setApiKey(provider, key) {
    this.apiKeys[provider] = key;
  }

  // Destruir chatbot
  destroy() {
    this.container.innerHTML = '';
    this.messages = [];
  }
}

// ═══════════════════════════════════════════════════════════════
// INTEGRACIÓN CON REVEAL.JS
// ═══════════════════════════════════════════════════════════════

let woChatbotInstance = null;

function initWoChatbot(containerId, options = {}) {
  if (woChatbotInstance) {
    woChatbotInstance.destroy();
  }
  
  woChatbotInstance = new WoChatbot(containerId, options);
  return woChatbotInstance;
}

function destroyWoChatbot() {
  if (woChatbotInstance) {
    woChatbotInstance.destroy();
    woChatbotInstance = null;
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.WoChatbot = WoChatbot;
  window.initWoChatbot = initWoChatbot;
  window.destroyWoChatbot = destroyWoChatbot;
}
