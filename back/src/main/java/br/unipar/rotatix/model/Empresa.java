package br.unipar.rotatix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "empresas")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String razaoSocial;

    @Column(length = 150)
    private String nomeFantasia;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    private String email;
    private String telefone;
    private String responsavelTecnico;

    @Column(nullable = false)
    private Double horasSemanaisAcumuladas = 0.0;

    @Column(nullable = false)
    private Boolean statusCicloConcluido = false;

    // ==========================================
    // GETTERS E SETTERS (As portas de entrada/saída)
    // ==========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getResponsavelTecnico() { return responsavelTecnico; }
    public void setResponsavelTecnico(String responsavelTecnico) { this.responsavelTecnico = responsavelTecnico; }

    public Double getHorasSemanaisAcumuladas() { return horasSemanaisAcumuladas; }
    public void setHorasSemanaisAcumuladas(Double horasSemanaisAcumuladas) { this.horasSemanaisAcumuladas = horasSemanaisAcumuladas; }

    public Boolean getStatusCicloConcluido() { return statusCicloConcluido; }
    public void setStatusCicloConcluido(Boolean statusCicloConcluido) { this.statusCicloConcluido = statusCicloConcluido; }
}