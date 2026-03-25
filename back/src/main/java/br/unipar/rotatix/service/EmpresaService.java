package br.unipar.rotatix.service;

import br.unipar.rotatix.model.Empresa;
import br.unipar.rotatix.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa salvar(Empresa empresa) {
        // Futuramente, aqui dentro faremos a validação:
        // if (empresa.getHorasSemanaisAcumuladas() > 40) { ... }
        return empresaRepository.save(empresa);
    }

    public List<Empresa> listarTodas() {
        return empresaRepository.findAll();
    }
}