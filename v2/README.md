# v2

Teste de contagem regressiva com AlpineJS.

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

* Quando entra na página, o sistema consulta no backend qual é o **tempo total** baseado na **hora inicial** e **hora final**, exemplo:

```
{
    "hora_final": "2022-12-11 12:10:00",
    "hora_inicial": "2022-12-11 12:00:00"
}
```

então o **tempo total** será

```
{
    "hora_final": "2022-12-11 12:10:00",
    "hora_inicial": "2022-12-11 12:00:00",
    "tempo_total": {
        "minutos": 10,
        "segundos": 0
    }
}
```

* Quando clicar no botão **Salvar**, o sistema salva a **hora final** no backend, exemplo:

```
{
    "hora_final": "2022-12-11 12:11:01",
    "hora_inicial": "2022-12-11 12:09:01"
}
```

* Ao clicar no botão **Salvar**, se o cronômetro (`remaining`) for menor ou igual a `1:00` minuto, então adiciona um **tempo total** de 2 minutos.

```
{
    "hora_final": "2022-12-11 12:11:01",
    "hora_inicial": "2022-12-11 12:09:01",
    "tempo_total": {
        "minutos": 2,
        "segundos": 0
    }
}
```
