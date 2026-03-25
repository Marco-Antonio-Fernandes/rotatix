package br.unipar.rotatix.repository;

import br.unipar.rotatix.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    
    // Só com essa linha acima, o Spring já te dá de "brinde" comandos como:
    // save(), findAll(), findById(), deleteById()
    
}