# v3

Teste de contagem regressiva com AlpineJS.

Inicial o sistema consulta a cada 1 segundo se o tempo atual é igual ou maior que o tempo salvo em `hora_inicial`.

## backend

```
npm install -g json-server
```

```
json-server --watch db.json
```

## frontend

```
npm install --global http-server
```

```
http-server
```

## Regras de negócio

* Inicial o sistema consulta a cada 1 segundo se o tempo atual é igual ou maior que o tempo salvo em `hora_inicial`.

* Quando entra na página, o sistema consulta no backend qual é o **tempo total** baseado na **hora inicial** e **hora final**, exemplo:

```
{
    "hora_final": "2022-12-11 12:10:00",
    "hora_inicial": "2022-12-11 12:00:00"
}
```

* Quando clicar no botão **Salvar**, o sistema salva a **hora final** no backend, exemplo:

```
{
    "hora_final": "2022-12-11 12:11:01",
    "hora_inicial": "2022-12-11 12:09:01"
}
```

* Ao clicar no botão **Salvar**, se o cronômetro (`remaining`) for menor ou igual a `1:00` minuto, então adiciona um **tempo total** de 2 minutos. Assim a nova `hora_final` será recalculada.

```
{
    "hora_final": "2022-12-11 12:11:01",
    "hora_inicial": "2022-12-11 12:09:01"
}
```
