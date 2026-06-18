# Nota de Análise da Estrutura do SBOM — SAGRES Monitoria v1.0.0

**Artefato analisado:** `sbom.json` (raiz do repositório)
**Baseline:** tag `v1.0.0` — commit `506137595e3b3d884f9c8eb30aa635bb0b2dadc4`
**Ferramenta:** Trivy 0.71.1 (`trivy fs --format cyclonedx`)
**Formato:** CycloneDX 1.7 (JSON)

## Análise

O SBOM foi gerado no formato **CycloneDX 1.7** e identifica a versão de forma única
pelo campo `serialNumber` (URN/UUID) somado ao `version` do documento. A seção
`metadata` registra o `timestamp` da geração (UTC) e, em `metadata.tools.components`,
os dados da ferramenta: `name` = *trivy*, `version` = *0.71.1*, `group` = *aquasecurity*.
O componente-raiz aparece em `metadata.component`, representando o diretório auditado.

A seção `components` lista **49 componentes**: **2** do tipo `application` (as raízes
agregadoras dos dois ecossistemas) e **47** do tipo `library`. Por se tratar de um
monorepo com `frontend/package.json` (npm) **e** `backend/pom.xml` (Maven), o Trivy
escaneou os dois ecossistemas no mesmo arquivo: **35 componentes npm** e **12 Maven**.
As dependências transitivas do npm foram resolvidas via `frontend/package-lock.json`;
no Maven, apenas as diretas do `pom.xml` foram captadas, pois as versões herdadas do
parent `spring-boot-starter-parent` não são resolvidas sem build (aviso do Trivy).

Cada componente traz `bom-ref`, `name`, `version`, `type` e `purl` (ex.:
`pkg:npm/agent-base@6.0.2`, `pkg:maven/br.ufg/sagres@0.0.1-SNAPSHOT`). O campo
`licenses` está presente em **35 dos 49** componentes (em geral os npm; ex.: `MIT`);
nos componentes Maven a licença não foi populada pela mesma limitação de resolução.
O campo `hashes` **não foi populado em nenhum componente** (0/49) — o scan de
manifestos do Trivy não calcula hashes de integridade por componente; a integridade
da baseline é garantida em separado pelos hashes SHA-256 dos arquivos (`hashes.txt`).
A seção `dependencies` (50 nós) descreve o grafo de relacionamento entre os componentes.

## Limitações conhecidas do SBOM

- Sem `--scanners vuln`, o relatório CycloneDX não inclui vulnerabilidades (CVEs); a
  análise de vulnerabilidades é tratada na seção "Problemas Conhecidos" do VDD.
- Dependências transitivas do Maven não aparecem (versão herdada do parent não resolvida
  sem build).
- Campo `hashes` por componente ausente — esperado para SBOM de manifestos.
- Dependências de desenvolvimento/teste são suprimidas por padrão pelo Trivy.
