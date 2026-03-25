package br.unipar.rotatix.controller;

import br.unipar.rotatix.model.Empresa;
import br.unipar.rotatix.service.EmpresaService; // Importamos o Service agora
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService; // Trocamos Repository por Service

    @PostMapping
    public Empresa cadastrarEmpresa(@RequestBody Empresa novaEmpresa) {
        // Chamamos o método salvar do Service
        return empresaService.salvar(novaEmpresa);
    }

    @GetMapping
    public List<Empresa> listarEmpresas() {
        // Chamamos o método listarTodas do Service
        return empresaService.listarTodas();
    }
}