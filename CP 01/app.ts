interface Livro {
    id: number;
    titulo: string;
    autor: string;
    paginas: number;
    genero?: string;
  }
  
  class Biblioteca {
    private livros: Livro[] = [];
  
    constructor() {
      this.carregarLivros();
    }
  
    
    private carregarLivros() {
      const livrosSalvos = localStorage.getItem('livros');
      if (livrosSalvos) {
        this.livros = JSON.parse(livrosSalvos);
      }
    }
  
    
    private salvarLivros() {
      localStorage.setItem('livros', JSON.stringify(this.livros));
    }
  
    
    public adicionarLivro(livro: Livro): void {
      this.livros.push(livro);
      this.salvarLivros();
    }
  
    
    public listarLivros(): Livro[] {
      return this.livros;
    }
  
    
    public buscarPorAutor(autor: string): Livro[] {
      return this.livros.filter(livro => livro.autor.toLowerCase().includes(autor.toLowerCase()));
    }
  
    
    public editarLivro(id: number, livroEditado: Livro): void {
      const index = this.livros.findIndex(livro => livro.id === id);
      if (index !== -1) {
        this.livros[index] = { ...this.livros[index], ...livroEditado };
        this.salvarLivros();
      }
    }
  }
  
  const biblioteca = new Biblioteca();
  
  
  function exibirLivros(livros: Livro[]) {
    const livrosListDiv = document.getElementById('livros-list')!;
    livrosListDiv.innerHTML = ''; 
  
    livros.forEach(livro => {
      const livroDiv = document.createElement('div');
      livroDiv.classList.add('book-item');
      livroDiv.innerHTML = `
        <strong>Título:</strong> ${livro.titulo} <br>
        <strong>Autor:</strong> ${livro.autor} <br>
        <strong>Páginas:</strong> ${livro.paginas} <br>
        <strong>Gênero:</strong> ${livro.genero || 'N/A'} <br>
        <button onclick="editarLivro(${livro.id})">Editar</button>
      `;
      livrosListDiv.appendChild(livroDiv);
    });
  }
  
  
  document.getElementById('form-add-book')!.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const titulo = (document.getElementById('titulo') as HTMLInputElement).value;
    const autor = (document.getElementById('autor') as HTMLInputElement).value;
    const paginas = Number((document.getElementById('paginas') as HTMLInputElement).value);
    const genero = (document.getElementById('genero') as HTMLInputElement).value || undefined;
  
    const novoLivro: Livro = {
      id: Date.now(), 
      titulo,
      autor,
      paginas,
      genero
    };
  
    biblioteca.adicionarLivro(novoLivro);
    exibirLivros(biblioteca.listarLivros());
  });
  
  
  document.getElementById('btn-search')!.addEventListener('click', () => {
    const autor = (document.getElementById('search-author') as HTMLInputElement).value;
    const livrosEncontrados = biblioteca.buscarPorAutor(autor);
    exibirLivros(livrosEncontrados);
  });
  
  
  function editarLivro(id: number) {
    const livro = biblioteca.listarLivros().find(livro => livro.id === id);
    if (livro) {
      const novoTitulo = prompt('Novo título:', livro.titulo);
      const novoAutor = prompt('Novo autor:', livro.autor);
      const novasPaginas = prompt('Novas páginas:', livro.paginas.toString());
      const novoGenero = prompt('Novo gênero:', livro.genero || '');
  
      if (novoTitulo && novoAutor && novasPaginas) {
        const livroEditado: Livro = {
          id,
          titulo: novoTitulo,
          autor: novoAutor,
          paginas: Number(novasPaginas),
          genero: novoGenero || undefined
        };
  
        biblioteca.editarLivro(id, livroEditado);
        exibirLivros(biblioteca.listarLivros());
      }
    }
  }
  
  
  exibirLivros(biblioteca.listarLivros());
  
  