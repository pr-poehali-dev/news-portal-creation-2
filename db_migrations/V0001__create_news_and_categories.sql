CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    category_code VARCHAR(50) NOT NULL REFERENCES categories(code),
    time_label VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (code, label, icon) VALUES
('politics', 'Политика', 'Landmark'),
('economy', 'Экономика', 'TrendingUp'),
('business', 'Бизнес', 'Briefcase'),
('beauty', 'Красота', 'Sparkles'),
('fashion', 'Мода', 'Shirt'),
('sale', 'Продажа', 'ShoppingBag');

INSERT INTO news (title, category_code, time_label, image_url, description) VALUES
('Президент подписал важный закон о развитии экономики', 'politics', '2 часа назад', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
('Центробанк снизил ключевую ставку: что это значит для экономики', 'economy', '4 часа назад', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
('Российские стартапы привлекли рекордные инвестиции', 'business', '6 часов назад', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
('Новые тренды в макияже: что будет популярно этой осенью', 'beauty', '8 часов назад', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
('Главные модные показы недели: обзор коллекций', 'fashion', '10 часов назад', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
('Черная пятница началась: лучшие скидки на электронику', 'sale', '12 часов назад', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
